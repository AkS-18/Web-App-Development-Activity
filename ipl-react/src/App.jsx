
import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Matches from "./components/Matches";
import Booking from "./components/Booking";
import MyBookings from "./components/MyBookings";
import Guidelines from "./components/Guidelines";
import Footer from "./components/Footer";
import { teams, venues, categories, guidelines } from "./data/siteData";
import { supabase } from "./supabase";

function App() {
  const [matches, setMatches] = useState([]);
  const [matchesError, setMatchesError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Supabase matches error:", error);
        setMatchesError(error.message);
        return;
      }

      const formattedMatches = (data || []).map((row) => ({
        id: row.id,
        teams: row.teams,
        teamCodes: row.team_codes,
        date: row.match_date,
        venue: row.venue,
        prices: {
          General: row.price_general,
          Premium: row.price_premium,
          VIP: row.price_vip,
        },
      }));

      setMatches(formattedMatches);
      setMatchesError("");
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const handleBookClick = (matchName) => {
    setSelectedMatch(matchName);
    notify("Opening the ticket booking form...");
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const addBooking = async (booking) => {
    const matchRow = matches.find(
      (m) => m.teams === booking.match
    );

    if (!matchRow) {
      notify("Please select a valid match.");
      return false;
    }

    // Generate the booking code before saving.
    const bookingCode = `BK-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 6)
      .toUpperCase()}`;

    const bookingData = {
      booking_code: bookingCode,
      match_id: matchRow.id,
      match_name: matchRow.teams,
      category: booking.category,
      quantity: booking.quantity,
      customer_name: booking.name.trim(),
      customer_email: booking.email.trim() || null,
      customer_phone: booking.phone.trim() || null,
      total_amount: booking.total,
    };

    // Insert only. Do not select the row back,
    // because that requires SELECT permission.
    const { error } = await supabase
      .from("bookings")
      .insert(bookingData);

    if (error) {
      console.error("Supabase booking error:", error);
      notify("Booking failed: " + error.message);
      return false;
    }

    // Update the app's local booking list.
    const newBooking = {
      id: bookingCode,
      booking_code: bookingCode,
      match: matchRow.teams,
      category: booking.category,
      quantity: booking.quantity,
      total: booking.total,
    };

    setBookings((prev) => [...prev, newBooking]);

    notify("Booking saved to Supabase!");

    // Return the generated code to Booking.jsx.
    return { booking_code: bookingCode };
  };

  return (
    <>
      <Navbar />

      <Hero
        title="Experience The Stadium Energy Live!"
        subtitle="Watch your favourite IPL teams compete live in the stadium."
      />

      <About teams={teams} venues={venues} />

      {matchesError && (
        <p className="supabase-error">
          Could not load matches from Supabase: {matchesError}
        </p>
      )}

      <Matches
        matches={matches}
        teams={teams}
        onBook={handleBookClick}
        notify={notify}
      />

      <Booking
        matches={matches}
        categories={categories}
        match={selectedMatch}
        onMatchChange={setSelectedMatch}
        onConfirm={addBooking}
        notify={notify}
      />

      <MyBookings bookings={bookings} />

      <Guidelines items={guidelines} />

      <Footer />

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default App;
