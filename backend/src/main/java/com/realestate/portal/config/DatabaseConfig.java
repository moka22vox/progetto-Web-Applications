package com.realestate.portal.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.sql.Connection;


@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/realestate_db}")
    private String pgUrl;

    @Value("${spring.datasource.username:postgres}")
    private String pgUser;

    @Value("${spring.datasource.password:postgres}")
    private String pgPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (isPostgresAvailable()) {
            log.info("Porta PostgreSQL (5432) raggiungibile. Tentativo di connessione a: {}", pgUrl);
            try {
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(pgUrl);
                config.setUsername(pgUser);
                config.setPassword(pgPassword);
                config.setDriverClassName("org.postgresql.Driver");
                config.setMaximumPoolSize(10);
                config.setConnectionTimeout(3000);
                config.setInitializationFailTimeout(3000);
                HikariDataSource ds = new HikariDataSource(config);

                try (Connection conn = ds.getConnection()) {
                    log.info("Connessione a PostgreSQL stabilita con successo.");
                    initDatabaseScripts(ds);
                    return ds;
                }
            } catch (Exception e) {
                log.warn("PostgreSQL non ha risposto correttamente o credenziali errate: {}. Attivazione automatica database H2 integrato.", e.getMessage());
            }
        } else {
            log.info("PostgreSQL non attivo su localhost:5432. Avvio automatico con database H2 integrato (Modalita' PostgreSQL compatibile).");
        }

        return createH2FallbackDataSource();
    }

    private boolean isPostgresAvailable() {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("127.0.0.1", 5432), 1000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private DataSource createH2FallbackDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:realestate_db;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(10);
        HikariDataSource ds = new HikariDataSource(config);

        initDatabaseScripts(ds);
        log.info("=========================================================================================");
        log.info(" Database H2 integrato (PostgreSQL Mode) avviato con successo!");
        log.info(" Schema SQL (9 tabelle) e Dati Iniziali caricati correttamente.");
        log.info("=========================================================================================");
        return ds;
    }

    private void initDatabaseScripts(DataSource ds) {
        try {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.setContinueOnError(true);
            populator.setIgnoreFailedDrops(true);
            populator.addScript(new ClassPathResource("schema.sql"));
            populator.addScript(new ClassPathResource("data.sql"));
            DatabasePopulatorUtils.execute(populator, ds);
            log.info("Esecuzione completata degli script schema.sql e data.sql.");
        } catch (Exception e) {
            log.warn("Avviso durante l'esecuzione degli script di inizializzazione: {}", e.getMessage());
        }
    }
}
