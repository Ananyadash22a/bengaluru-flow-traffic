package com.bengaluruflow;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BengaluruFlowApiApplicationTests {
	@Autowired private MockMvc mvc;

	@Test
	void seededZonesAndIncidentsAreAvailable() throws Exception {
		mvc.perform(get("/api/traffic/zones"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].name").exists());
		mvc.perform(get("/api/incidents"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].status").value("ACTIVE"));
	}

	@Test
	void incidentSubmissionPersistsAndRouteOptimizationReturnsSimulation() throws Exception {
		mvc.perform(post("/api/incidents").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"type":"Accident","location":"Test Outer Ring Road","severity":"HIGH","description":"Vehicle collision blocking the left lane."}
						"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").exists());
		mvc.perform(get("/api/incidents"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].location").value("Test Outer Ring Road"));
		mvc.perform(post("/api/routes/optimize").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"origin":"Whitefield","destination":"Manipal Hospital","priority":"HIGH"}
						"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.simulated").value(true))
				.andExpect(jsonPath("$.route.length()").isNotEmpty());
		mvc.perform(post("/api/emergency/request").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"origin":"Whitefield","destination":"Manipal Hospital","priority":"HIGH"}
						"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").exists());
	}

	@Test
	void registeredUserCannotUpdateOperatorTraffic() throws Exception {
		String response = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email":"traffic-test@example.com","password":"TrafficDemo42"}
						"""))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		String token = new com.fasterxml.jackson.databind.ObjectMapper().readTree(response).get("token").asText();
		mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email":"traffic-test@example.com","password":"TrafficDemo42"}
						"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty());
		mvc.perform(put("/api/traffic/zones/1").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"congestion":40,"speed":30,"delay":5}
						"""))
				.andExpect(status().isForbidden());
	}

}
