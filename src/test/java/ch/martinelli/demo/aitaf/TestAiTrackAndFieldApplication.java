package ch.martinelli.demo.aitaf;

import org.springframework.boot.SpringApplication;

public class TestAiTrackAndFieldApplication {

    public static void main(String[] args) {
        SpringApplication.from(AiTrackAndFieldApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
