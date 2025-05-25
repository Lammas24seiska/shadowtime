package fi.lammas.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Session {

    @Id
    private String id; // public session ID

    private String hostSecret; // only known by the host

    @OneToMany(mappedBy = "session")
    private List<ParticipantSession> participants = new ArrayList<>();

    public Session() {}

    public Session(String id, String hostSecret) {
        this.id = id;
        this.hostSecret = hostSecret;
    }

    public String getId() {
        return id;
    }

    public String getHostSecret() {
        return hostSecret;
    }

    public List<ParticipantSession> getParticipants() {
        return participants;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setHostSecret(String hostSecret) {
        this.hostSecret = hostSecret;
    }

    public void setParticipants(List<ParticipantSession> participants) {
        this.participants = participants;
    }
}

