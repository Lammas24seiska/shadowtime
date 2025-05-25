package fi.lammas.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.util.UUID;

@Entity
public class ParticipantSession {

    @Id
    private String id;  // A unique ID stored in localStorage by frontend, identifies the participant anonymously

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    private String name;  // Optional: participants can give a name or alias

    private String availabilityJson;  // Placeholder for availability info (e.g., time slots)

    public ParticipantSession() {}

    public ParticipantSession(Session session) {
        this.id = UUID.randomUUID().toString();
        this.session = session;
    }

    public String getId() {
        return id;
    }

    public Session getSession() {
        return session;
    }

    public String getAvailabilityJson() {
        return availabilityJson;
    }

    public void setAvailabilityJson(String availabilityJson) {
        this.availabilityJson = availabilityJson;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
