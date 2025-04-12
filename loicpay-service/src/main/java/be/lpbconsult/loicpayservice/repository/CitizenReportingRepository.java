package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.CitizenReporting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CitizenReportingRepository extends JpaRepository<CitizenReporting, Long> {
    Optional<CitizenReporting> findBySsinAndRefMonth(String ssin, Integer refMonth);
}
