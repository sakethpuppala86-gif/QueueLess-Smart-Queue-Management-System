import { useEffect, useState } from "react";

function StaffDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET ALL QUEUE TICKETS
  // ==========================================
  const fetchTickets = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/queue?t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch queue");
      }

      const data = await response.json();

      console.log("Queue data:", data);

      setTickets(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // ==========================================
  // LOAD TICKETS
  // ==========================================
  useEffect(() => {
    fetchTickets();

    const interval = setInterval(() => {
      fetchTickets();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // CALL NEXT CUSTOMER
  // ==========================================
  const callNextCustomer = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/queue/call-next",
        {
          method: "POST",
        }
      );

      // Handle backend error
      if (!response.ok) {
        const errorData = await response.json();

        alert(
          errorData.message ||
            "Unable to call next customer."
        );

        return;
      }

      await response.json();

      await fetchTickets();

    } catch (error) {
      console.error(
        "Error calling next customer:",
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
  // COMPLETE CUSTOMER
  // ==========================================
  const completeCustomer = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/queue/complete/${id}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to complete customer"
        );
      }

      await response.json();

      await fetchTickets();

    } catch (error) {
      console.error(
        "Error completing customer:",
        error
      );

      alert(
        "Unable to complete customer."
      );
    }
  };

  // ==========================================
  // FILTER TICKETS
  // ==========================================

  const servingTicket = tickets.find(
    (ticket) =>
      String(ticket.status)
        .trim()
        .toUpperCase() === "SERVING"
  );

  const waitingTickets = tickets.filter(
    (ticket) =>
      String(ticket.status)
        .trim()
        .toUpperCase() === "WAITING"
  );

  const completedTickets = tickets.filter(
    (ticket) =>
      String(ticket.status)
        .trim()
        .toUpperCase() === "COMPLETED"
  );

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="staff-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="staff-header">

        <div className="logo">

          <span className="logo-icon">
            Q
          </span>

          <span>
            QueueLess
          </span>

        </div>

        <nav className="navigation">

          <a href="/">
            Customer
          </a>

          <a href="/staff">
            Staff Dashboard
          </a>

        </nav>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="staff-main">


        {/* ====================================
            CURRENTLY SERVING
        ==================================== */}

        <section className="staff-section">

          <h2>
            🔊 Currently Serving
          </h2>

          {servingTicket ? (

            <div className="staff-card serving">

              <div className="staff-token">
                {servingTicket.tokenNumber}
              </div>

              <div className="staff-details">

                <h3>
                  {servingTicket.customerName}
                </h3>

                <p>
                  Phone: {servingTicket.phone}
                </p>

                <p>
                  Service: {servingTicket.service}
                </p>

                <p className="staff-status">
                  SERVING
                </p>

              </div>

              <button
                className="complete-button"
                onClick={() =>
                  completeCustomer(
                    servingTicket.id
                  )
                }
              >
                Complete Customer
              </button>

            </div>

          ) : (

            <div className="empty-card">

              <p>
                No customer is currently being served.
              </p>

            </div>

          )}

        </section>


        {/* ====================================
            CALL NEXT CUSTOMER
        ==================================== */}

        <section className="staff-section">

          <button
            className="call-next-button"
            onClick={callNextCustomer}
            disabled={
              loading ||
              waitingTickets.length === 0 ||
              !!servingTicket
            }
          >

            {loading
              ? "Calling..."
              : "📢 Call Next Customer"}

          </button>

        </section>


        {/* ====================================
            WAITING QUEUE
        ==================================== */}

        <section className="staff-section">

          <h2>
            👥 Waiting Queue
          </h2>

          {waitingTickets.length > 0 ? (

            <div className="waiting-list">

              {waitingTickets.map(
                (ticket) => (

                  <div
                    className="staff-card"
                    key={ticket.id}
                  >

                    <div className="staff-token small">
                      {ticket.tokenNumber}
                    </div>

                    <div className="staff-details">

                      <h3>
                        {ticket.customerName}
                      </h3>

                      <p>
                        Service: {ticket.service}
                      </p>

                      <p>
                        Phone: {ticket.phone}
                      </p>

                      <p className="waiting-status">
                        WAITING
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-card">

              <p>
                No customers waiting.
              </p>

            </div>

          )}

        </section>


        {/* ====================================
            COMPLETED CUSTOMERS
        ==================================== */}

        <section className="staff-section">

          <h2>
            ✅ Completed Customers
          </h2>

          <p className="completed-count">

            Total Completed:{" "}

            <strong>
              {completedTickets.length}
            </strong>

          </p>

        </section>

      </main>


      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="staff-footer">

        <p>
          © 2026 QueueLess — Smart Queue
          Management System
        </p>

      </footer>

    </div>
  );
}

export default StaffDashboard;