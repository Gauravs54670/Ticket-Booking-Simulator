package com.gaurav.TicketBooking.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class NioAuditLogger {

    private final Path logFilePath = Paths.get("booking_audit.log");

    /**
     * Appends a log entry to the audit log file using Java NIO FileChannel and ByteBuffer.
     */
    public void writeLog(String message) {
        String logEntry = message + System.lineSeparator();
        byte[] bytes = logEntry.getBytes(StandardCharsets.UTF_8);

        // Allocate a ByteBuffer of the appropriate size
        ByteBuffer buffer = ByteBuffer.allocate(bytes.length);
        buffer.put(bytes);
        
        // Flip the buffer to prepare it for writing to the channel
        buffer.flip();

        // Open the FileChannel in WRITE, CREATE, and APPEND modes
        try (FileChannel fileChannel = FileChannel.open(logFilePath,
                StandardOpenOption.CREATE,
                StandardOpenOption.WRITE,
                StandardOpenOption.APPEND)) {
            
            while (buffer.hasRemaining()) {
                fileChannel.write(buffer);
            }
            log.info("NIO Audit Logger successfully appended log: {}", message);
        } catch (IOException e) {
            log.error("Failed to write log using Java NIO", e);
        }
    }

    /**
     * Reads all log entries from the audit log file using Java NIO FileChannel and ByteBuffer.
     */
    public List<String> readLogs() {
        List<String> logs = new ArrayList<>();
        if (!logFilePath.toFile().exists()) {
            return logs;
        }

        // Open the FileChannel in READ mode
        try (FileChannel fileChannel = FileChannel.open(logFilePath, StandardOpenOption.READ)) {
            long fileSize = fileChannel.size();
            if (fileSize == 0) {
                return logs;
            }

            // Allocate a ByteBuffer to hold the file content
            ByteBuffer buffer = ByteBuffer.allocate((int) fileSize);
            
            // Read channel data into buffer
            fileChannel.read(buffer);

            // Flip the buffer to prepare it for reading (decoding)
            buffer.flip();

            // Decode buffer bytes into String using UTF-8
            String content = StandardCharsets.UTF_8.decode(buffer).toString();
            if (!content.isEmpty()) {
                String[] lines = content.split(System.lineSeparator());
                logs.addAll(Arrays.asList(lines));
            }
        } catch (IOException e) {
            log.error("Failed to read logs using Java NIO", e);
        }
        return logs;
    }
}
