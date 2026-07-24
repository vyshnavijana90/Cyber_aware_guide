package com.cyberaware.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendSafetyEmail(String name, String email) {
        if (fromEmail == null || fromEmail.trim().isEmpty() || fromEmail.contains("your-system-email")) {
            org.slf4j.LoggerFactory.getLogger(EmailVerificationService.class)
                    .warn("System email is not configured in application.properties. Welcome safety email was not sent to " + email);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Welcome to CyberShield - Stay Safe Online!");
            
            String htmlContent = "<h3>Hello " + name + ",</h3>" +
                    "<p>Thank you for registering with <strong>CyberShield</strong>!</p>" +
                    "<p>Your account has been created successfully.</p>" +
                    "<p><strong>Please remember these essential cyber safety rules:</strong></p>" +
                    "<ul>" +
                    "<li><strong>Never share your passwords, bank details, or OTPs</strong> with anyone. CyberShield or bank staff will never ask for them.</li>" +
                    "<li><strong>Verify before clicking:</strong> Be extremely cautious of unsolicited links sent via SMS, email, or WhatsApp.</li>" +
                    "<li><strong>Beware of urgent requests:</strong> Scammers often create artificial urgency or fear (e.g., 'Your account will be blocked').</li>" +
                    "<li><strong>Verify identity:</strong> Always call back a known number or double-check through official channels if someone asks for money or personal details.</li>" +
                    "</ul>" +
                    "<p>Stay Safe & Secure,<br/><strong>The CyberShield Team</strong></p>";
                    
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            org.slf4j.LoggerFactory.getLogger(EmailVerificationService.class)
                    .info("Welcome safety email sent successfully to " + email);
        } catch (Exception ex) {
            org.slf4j.LoggerFactory.getLogger(EmailVerificationService.class)
                    .error("Failed to send welcome safety email to " + email + ": " + ex.getMessage());
        }
    }
}
