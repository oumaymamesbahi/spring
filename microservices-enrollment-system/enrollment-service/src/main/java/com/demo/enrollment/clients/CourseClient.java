package com.demo.enrollment.clients;

import com.demo.enrollment.dto.CourseInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class CourseClient {

    private final WebClient.Builder webClientBuilder;

    @Autowired
    public CourseClient(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public Mono<CourseInfoDTO> getCourseById(Long courseId) {
        return webClientBuilder
                .build()
                .get()
                .uri("http://course-service/api/courses/" + courseId)
                .retrieve()
                .bodyToMono(CourseInfoDTO.class);
    }

    public Mono<Boolean> courseExists(Long courseId) {
        return getCourseById(courseId)
                .map(course -> true)
                .onErrorReturn(false);
    }
}