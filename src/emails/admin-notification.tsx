import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface AdminNotificationEmailProps {
  companyName: string;
  location: string;
  scale: string;
  services: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalRequests?: string;
  submittedAt: string;
}

export default function AdminNotificationEmail({
  companyName,
  location,
  scale,
  services,
  contactName,
  contactPhone,
  contactEmail,
  additionalRequests,
  submittedAt,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>새로운 컨설팅 신청이 접수되었습니다</Heading>
          
          <Text style={text}>
            SoUHGM 호텔 컨설팅 서비스에 새로운 신청이 접수되었습니다.
          </Text>

          <Section style={infoSection}>
            <Heading as="h2" style={h2}>기본 정보</Heading>
            
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>기업명/호텔명:</Text>
              </Column>
              <Column>
                <Text style={value}>{companyName}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>위치:</Text>
              </Column>
              <Column>
                <Text style={value}>{location}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>규모:</Text>
              </Column>
              <Column>
                <Text style={value}>{scale}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading as="h2" style={h2}>연락처 정보</Heading>
            
            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>담당자명:</Text>
              </Column>
              <Column>
                <Text style={value}>{contactName}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>연락처:</Text>
              </Column>
              <Column>
                <Text style={value}>{contactPhone}</Text>
              </Column>
            </Row>

            <Row style={infoRow}>
              <Column style={labelColumn}>
                <Text style={label}>이메일:</Text>
              </Column>
              <Column>
                <Text style={value}>{contactEmail}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Heading as="h2" style={h2}>요청 서비스</Heading>
            {services.map((service, index) => (
              <Text key={index} style={serviceItem}>• {service}</Text>
            ))}
          </Section>

          {additionalRequests && (
            <>
              <Hr style={hr} />
              <Section style={infoSection}>
                <Heading as="h2" style={h2}>추가 요청사항</Heading>
                <Text style={additionalText}>{additionalRequests}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={infoSection}>
            <Text style={footerText}>
              <strong>신청 일시:</strong> {submittedAt}
            </Text>
            <Text style={footerText}>
              빠른 시일 내에 고객에게 연락하여 상담을 진행해 주세요.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '64px auto',
  padding: '20px 20px 48px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1C2A44', // Primary color
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '32px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1C2A44',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 8px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const infoSection = {
  margin: '24px 0',
};

const infoRow = {
  margin: '8px 0',
};

const labelColumn = {
  width: '140px',
  verticalAlign: 'top' as const,
};

const label = {
  color: '#525f7f',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const value = {
  color: '#1C2A44',
  fontSize: '14px',
  margin: '0',
};

const serviceItem = {
  color: '#1C2A44',
  fontSize: '14px',
  margin: '4px 0',
};

const additionalText = {
  color: '#1C2A44',
  fontSize: '14px',
  lineHeight: '20px',
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #e9ecef',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footerText = {
  color: '#525f7f',
  fontSize: '12px',
  margin: '4px 0',
};