
import { useState } from "react";

function Booking({
  matches,
  categories,
  match,
  onMatchChange,
  onConfirm,
  notify,
}) {
  const [category, setCategory] = useState("");
  const [tickets, setTickets] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  // Live booking summary
  const quantity = Math.min(
    Math.max(parseInt(tickets) || 0, 0),
    10
  );

  const selectedMatch = matches.find((m) => m.teams === match);

  const price =
    (selectedMatch && selectedMatch.prices[category]) || 0;

  const total = price * quantity;

  const handleMatch = (e) => {
    onMatchChange(e.target.value);
    setConfirmationCode("");
    notify("Match selected: " + (e.target.value || "none"));
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setConfirmationCode("");
    notify("Stand category updated!");
  };

  const handleTicketsBlur = () => {
    const fixed = Math.min(
      Math.max(parseInt(tickets) || 1, 1),
      10
    );

    setTickets(String(fixed));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !match ||
      !category ||
      quantity < 1 ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      notify("Please fill in all booking details.");
      return;
    }

    if (!selectedMatch) {
      notify("Please select a valid match.");
      return;
    }

    try {
      const saved = await onConfirm({
        match,
        category,
        quantity,
        total,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (!saved) return;

      // Read the booking code returned by App.jsx
      const code =
        typeof saved === "string"
          ? saved
          : saved.booking_code ||
            saved.bookingCode ||
            saved.code;

      setConfirmationCode(code || "Booking confirmed");

      notify(
        code
          ? "Booking saved! Your code is " + code
          : "Booking successfully saved!"
      );

      // Reset form after successful booking
      onMatchChange("");
      setCategory("");
      setTickets("1");
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Booking error:", error);
      notify("Booking failed. Please try again.");
    }
  };

  return (
    <section id="booking">
      <h2>Book Your IPL Tickets</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="match">Select Match:</label>
        <select
          id="match"
          name="match"
          value={match}
          onChange={handleMatch}
          required
        >
          <option value="">Choose Match</option>

          {matches.map((m) => (
            <option key={m.id} value={m.teams}>
              {m.teams}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label htmlFor="category">Stand Category:</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={handleCategory}
          required
        >
          <option value="">Choose Category</option>

          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <br />
        <br />

        <label htmlFor="tickets">Number of Tickets:</label>
        <input
          type="number"
          id="tickets"
          name="tickets"
          min="1"
          max="10"
          value={tickets}
          onChange={(e) => {
            setTickets(e.target.value);
            setConfirmationCode("");
          }}
          onBlur={handleTicketsBlur}
          required
        />

        <br />
        <br />

        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">Confirm Booking</button>
      </form>

      {confirmationCode && (
        <div className="confirmation-message">
          <h3>Booking Confirmed!</h3>
          <p>Your booking has been saved successfully.</p>
          <p>
            Booking Code: <strong>{confirmationCode}</strong>
          </p>
        </div>
      )}

      <aside id="bookingSummary">
        <h2>Booking Summary</h2>

        <p>
          Match: <span>{match || "Not selected"}</span>
        </p>

        <p>
          Stand Category: <span>{category || "Not selected"}</span>
        </p>

        <p>
          Number of Tickets: <span>{quantity}</span>
        </p>

        <p>
          Price per Ticket: ₹
          <span>{price.toLocaleString("en-IN")}</span>
        </p>

        <h3>
          Total Price: ₹
          <span>{total.toLocaleString("en-IN")}</span>
        </h3>
      </aside>
    </section>
  );
}

export default Booking;
