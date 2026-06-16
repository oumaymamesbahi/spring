package com.demo.enrollment.clients;

import com.demo.enrollment.dto.StudentInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class StudentClient {

    private final WebClient.Builder webClientBuilder;

    @Autowired
    public StudentClient(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<StudentInfoDTO> getStudentByCnie(String cnie) {
        return webClientBuilder
                .build()
                .get()
                .uri("http://student-service/api/students/cnie/" + cnie)
                .retrieve()
                .bodyToMono(StudentInfoDTO.class);
    }

    public Mono<Boolean> studentExists(String cnie) {
        return getStudentByCnie(cnie)
                .map(student -> true)
                .onErrorReturn(false);
    }
}