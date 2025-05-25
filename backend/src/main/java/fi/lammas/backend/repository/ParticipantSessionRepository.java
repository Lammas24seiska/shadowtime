package fi.lammas.backend.repository;

import fi.lammas.backend.model.ParticipantSession;
import fi.lammas.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantSessionRepository extends JpaRepository<ParticipantSession, String> {

    List<ParticipantSession> findBySession(Session session);

    Optional<ParticipantSession> findByIdAndSession(String id, Session session);
}
