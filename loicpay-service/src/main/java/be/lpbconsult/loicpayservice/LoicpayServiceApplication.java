package be.lpbconsult.loicpayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "be.lpbconsult.loicpayservice.entity")
public class LoicpayServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoicpayServiceApplication.class, args);
	}

}
