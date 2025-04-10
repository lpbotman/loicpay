package be.lpbconsult.loicpayservice.repository;

import be.lpbconsult.loicpayservice.entity.PaymentBatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class PaymentBatchRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Exemple de méthode pour récupérer tous les PaymentBatchs
    public List<PaymentBatch> findAll() {
        String sql = "SELECT id, name FROM payment_batch";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PaymentBatch paymentBatch = new PaymentBatch();
            paymentBatch.setId(rs.getLong("id"));
            paymentBatch.setName(rs.getString("name"));
            return paymentBatch;
        });
    }

    public Long addPaymentBatch(PaymentBatch paymentBatch) {
        String sql = "INSERT INTO payment_batch (name) VALUES (?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(
                connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql, new String[] {"id"});
                    ps.setString(1, paymentBatch.getName());
                    return ps;
                },
                keyHolder
        );
        return keyHolder.getKey().longValue();
    }
}
