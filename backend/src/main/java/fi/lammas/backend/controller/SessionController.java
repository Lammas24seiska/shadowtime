package fi.lammas.backend.controller;

import fi.lammas.backend.model.ParticipantSession;
import fi.lammas.backend.model.Session;
import fi.lammas.backend.repository.ParticipantSessionRepository;
import fi.lammas.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ParticipantSessionRepository participantRepository;

    // DTO to avoid leaking hostSecret
    public static class SessionDto {
        private String id;
        private List<String> participantIds;

        public SessionDto(Session session) {
            this.id = session.getId();
            this.participantIds = session.getParticipants()
                .stream()
                .map(ParticipantSession::getId)
                .collect(Collectors.toList());
        }

        public String getId() { return id; }
        public List<String> getParticipantIds() { return participantIds; }
    }

    // DTO for safe participant session response
    public static class ParticipantSessionDto {
        private String id;
        private String name;
        private String availabilityJson;
        private String sessionId;

        public ParticipantSessionDto(ParticipantSession participant) {
            this.id = participant.getId();
            this.name = participant.getName();
            this.availabilityJson = participant.getAvailabilityJson();
            this.sessionId = participant.getSession() != null ? participant.getSession().getId() : null;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getAvailabilityJson() { return availabilityJson; }
        public String getSessionId() { return sessionId; }
    }

    @PostMapping("/create/{sessionIdWithSecret}")
    public SessionDto createSession(@PathVariable String sessionIdWithSecret) {
        // Split into public ID and host secret
        String[] parts = sessionIdWithSecret.split("_", 2);

        if (parts.length != 2) {
            throw new IllegalArgumentException("Session ID must be in format: sessionId_secret");
        }

        String sessionId = parts[0];
        String hostSecret = parts[1];

        if (sessionRepository.findById(sessionId).isEmpty()) {
            Session session = new Session(sessionId, hostSecret);
            sessionRepository.save(session);
        }
        return new SessionDto(sessionRepository.findById(sessionId).get());
    }

    @PostMapping("/join/{sessionId}")
    public ParticipantSessionDto joinSession(
            @PathVariable String sessionId,
            @RequestBody(required = false) String participantId // May be null if new user
    ) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));

        if (participantId != null) {
            Optional<ParticipantSession> existing = participantRepository.findByIdAndSession(participantId, session);
            if (existing.isPresent()) {
                return new ParticipantSessionDto(existing.get());
            }
        }

        // Create a new ParticipantSession
        ParticipantSession participant = new ParticipantSession(session);
        participantRepository.save(participant);
        return new ParticipantSessionDto(participant);
    }

    @GetMapping("/session/{sessionId}")
    public SessionDto getSession(@PathVariable String sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
        return new SessionDto(session);
    }

    @GetMapping("/ping")
    public String ping() {
    return "pong";
}
}
