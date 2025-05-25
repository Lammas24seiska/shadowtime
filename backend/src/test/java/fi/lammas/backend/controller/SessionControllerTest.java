package fi.lammas.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.lammas.backend.model.Session;
import fi.lammas.backend.repository.SessionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private fi.lammas.backend.repository.ParticipantSessionRepository participantSessionRepository;

    @BeforeEach
    void setup() {
        participantSessionRepository.deleteAll();
        sessionRepository.deleteAll();
    }

    @Test
    void testPing() throws Exception {
        mockMvc.perform(get("/api/ping"))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));
    }

    @Test
    void testCreateSession() throws Exception {
        String sessionId = "testsession";
        String secret = "mysecret";
        mockMvc.perform(post("/api/create/" + sessionId + "_" + secret))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.participantIds").isArray());
        // hostSecret should not be in the response
        Session session = sessionRepository.findById(sessionId).orElse(null);
        assertThat(session).isNotNull();
        assertThat(session.getHostSecret()).isEqualTo(secret);
    }

    @Test
    void testJoinSessionAndGetSession() throws Exception {
        String sessionId = "joinable";
        String secret = "hostsecret";
        // Create session
        mockMvc.perform(post("/api/create/" + sessionId + "_" + secret))
                .andExpect(status().isOk());

        // Join session
        String joinResponse = mockMvc.perform(post("/api/join/" + sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.sessionId").value(sessionId))
                .andReturn().getResponse().getContentAsString();

        // Get session info
        mockMvc.perform(get("/api/session/" + sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId))
                .andExpect(jsonPath("$.participantIds").isArray());
    }

    @Test
    void testJoinSessionWithInvalidIdReturns404() throws Exception {
        mockMvc.perform(post("/api/join/doesnotexist"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetSessionWithInvalidIdReturns404() throws Exception {
        mockMvc.perform(get("/api/session/doesnotexist"))
                .andExpect(status().isNotFound());
    }
}
