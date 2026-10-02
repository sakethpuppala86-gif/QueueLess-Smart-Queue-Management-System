import { useEffect, useState } from "react";

function CustomerPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("General");

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentServing, setCurrentServing] = useState(null);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);

  // ==========================================
  // GET CURRENT SERVING CUSTOMER
  // ==========================================
  useEffect(() => {
    const fetchCurrentServing = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/queue"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch queue");
        }

        const data = await response.json();

        const servingTicket = data.find(
          (item) => item.status === "SERVING"
        );

        setCurrentServing(servingTicket || null);

      } catch (error) {
        console.error(
          "Error fetching current serving ticket:",
          error
        );
      }
    };

    fetchCurrentServing();

    const interval = setInterval(
      fetchCurrentServing,
      3000
    );

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // CHECK CUSTOMER TICKET STATUS
  // ==========================================
  useEffect(() => {
    if (!ticket) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        // Get this customer's latest ticket
        const response = await fetch(
          `http://localhost:8080/api/queue/${ticket.id}`
        );

        if (response.ok) {
          const updatedTicket = await response.json();

          setTicket(updatedTicket);

          // Get all queue tickets
          const queueResponse = await fetch(
            "http://localhost:8080/api/queue"
          );

          if (queueResponse.ok) {
            const queueData = await queueResponse.json();

            // Find waiting customers before this customer
            const waitingBefore = queueData.filter(
              (item) =>
                item.status === "WAITING" &&
                item.tokenNumber <
                  updatedTicket.tokenNumber
            );

            setQueuePosition(
              waitingBefore.length
            );

            // Estimate 5 minutes per customer
            setEstimatedWait(
              waitingBefore.length * 5
            );
          }
        }

      } catch (error) {
        console.error(
          "Status update failed:",
          error
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [ticket]);

  // ==========================================
  // GET QUEUE TOKEN
  // ==========================================
  const getToken = async () => {

    // Validate customer name
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Validate phone number is entered
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    // Validate phone number has exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone.trim())) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/queue",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: name,
            phone: phone,
            service: service,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to create ticket"
        );
      }

      const data = await response.json();

      // Store ticket
      setTicket(data);

      // Clear form
      setName("");
      setPhone("");

    } catch (error) {
      console.error(
        "Error creating ticket:",
        error
      );

      alert(
        "Unable to connect to QueueLess server."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="app">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">

        <div className="logo">

          <span className="logo-icon">
            Q
          </span>

          <span>
            QueueLess
          </span>

        </div>

        <nav className="navigation">

          <a
            href="/"
            className="nav-link"
          >
            Customer
          </a>

          <a
            href="/staff"
            className="nav-link"
          >
            Staff Dashboard
          </a>

        </nav>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="main">

        {/* ====================================
            NOW SERVING
        ==================================== */}

        {currentServing && (

          <section className="serving-card">

            <h2>
              🔊 Now Serving
            </h2>

            <div className="serving-token">
              {currentServing.tokenNumber}
            </div>

            <p>
              Token{" "}
              <strong>
                {currentServing.tokenNumber}
              </strong>{" "}
              is currently being served.
            </p>

            <p>
              Customer:{" "}
              <strong>
                {currentServing.customerName}
              </strong>
            </p>

          </section>

        )}


        {/* ====================================
            HERO
        ==================================== */}

        <section className="hero">

          <h1>
            Skip the <span>Wait.</span>
          </h1>

          <p>
            Get your digital queue token
            and wait comfortably.
          </p>

        </section>


        {/* ====================================
            QUEUE FORM
        ==================================== */}

        <section className="card">

          <h2>
            Get Your Queue Token
          </h2>

          <p className="card-description">
            Enter your details to join the queue.
          </p>


          {/* CUSTOMER NAME */}

          <div className="form-group">

            <label>
              Customer Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* PHONE NUMBER */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </div>


          {/* SERVICE */}

          <div className="form-group">

            <label>
              Select Service
            </label>

            <select
              value={service}
              onChange={(e) =>
                setService(e.target.value)
              }
            >

              <option value="General">
                General
              </option>

              <option value="Consultation">
                Consultation
              </option>

              <option value="Payment">
                Payment
              </option>

              <option value="Support">
                Support
              </option>

            </select>

          </div>


          {/* GET TOKEN BUTTON */}

          <button
            className="token-button"
            onClick={getToken}
            disabled={loading}
          >

            {loading
              ? "Getting Token..."
              : "Get Queue Token"}

          </button>

        </section>


        {/* ====================================
            CUSTOMER TICKET
        ==================================== */}

        {ticket && (

          <section className="ticket-card">

            <p className="ticket-title">
              Your Queue Token
            </p>


            {/* TOKEN NUMBER */}

            <div className="token-number">
              {ticket.tokenNumber}
            </div>


            {/* CUSTOMER NAME */}

            <p className="customer-name">
              {ticket.customerName}
            </p>


            {/* STATUS */}

            <div className="status">
              {ticket.status}
            </div>


            {/* SERVICE */}

            <p className="service-name">
              Service: {ticket.service}
            </p>


            {/* ==================================
                WAITING
            ================================== */}

            {ticket.status === "WAITING" && (
              <>

                <p className="queue-position">
                  👥 People Ahead:{" "}
                  <strong>
                    {queuePosition}
                  </strong>
                </p>

                <p className="estimated-wait">
                  ⏱ Estimated Wait:{" "}
                  <strong>
                    {estimatedWait} minutes
                  </strong>
                </p>

                <p className="success-message">
                  You have successfully joined
                  the queue.
                </p>

              </>
            )}


            {/* ==================================
                SERVING
            ================================== */}

            {ticket.status === "SERVING" && (

              <p className="success-message">
                🎉 It's your turn! Please proceed
                to the counter.
              </p>

            )}


            {/* ==================================
                COMPLETED
            ================================== */}

            {ticket.status === "COMPLETED" && (

              <p className="success-message">
                ✅ Your service has been completed.
              </p>

            )}

          </section>

        )}

      </main>


      {/* ======================================
          FOOTER
      ====================================== */}

      <footer>

        <p>
          © 2026 QueueLess —
          Smart Queue Management System
        </p>

      </footer>

    </div>
  );
}

export default CustomerPage;