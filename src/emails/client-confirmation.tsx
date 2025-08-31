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

interface ClientConfirmationEmailProps {
  companyName: string;
  contactName: string;
  services: string[];
  submittedAt: string;
}

export default function ClientConfirmationEmail({
  companyName,
  contactName,
  services,
  submittedAt,
}: ClientConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={h1}>LodgeX</Heading>
            <Text style={headerSubtitle}>호텔 위탁운영 & 컨설팅</Text>
          </Section>

          <Hr style={hr} />

          <Section style={contentSection}>
            <Heading as="h2" style={h2}>
              안녕하세요, {contactName}님
            </Heading>
            
            <Text style={text}>
              LodgeX 호텔 컨설팅 서비스에 신청해 주셔서 감사합니다.
            </Text>

            <Text style={text}>
              {companyName}에서 신청하신 컨설팅 요청이 정상적으로 접수되었습니다.
            </Text>

            <Section style={summarySection}>
              <Heading as="h3" style={h3}>신청 내용 요약</Heading>
              
              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>신청 기업:</Text>
                </Column>
                <Column>
                  <Text style={value}>{companyName}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>신청 일시:</Text>
                </Column>
                <Column>
                  <Text style={value}>{submittedAt}</Text>
                </Column>
              </Row>

              <Row style={infoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>요청 서비스:</Text>
                </Column>
                <Column>
                  {services.map((service, index) => (
                    <Text key={index} style={serviceItem}>• {service}</Text>
                  ))}
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section style={nextStepsSection}>
              <Heading as="h3" style={h3}>다음 단계</Heading>
              
              <Text style={stepText}>
                <strong>1. 담당자 배정</strong><br />
                영업일 기준 1-2일 내에 전담 컨설턴트를 배정해 드립니다.
              </Text>

              <Text style={stepText}>
                <strong>2. 초기 상담</strong><br />
                배정된 컨설턴트가 직접 연락드려 상세한 요구사항을 파악합니다.
              </Text>

              <Text style={stepText}>
                <strong>3. 현장 분석 및 제안</strong><br />
                호텔 현장 분석을 통해 맞춤형 컨설팅 방안을 제시합니다.
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={contactSection}>
              <Heading as="h3" style={h3}>문의사항이 있으시면</Heading>
              
              <Text style={contactText}>
                궁금한 사항이 있으시거나 긴급한 문의가 필요하시면<br />
                언제든지 아래 연락처로 문의해 주세요.
              </Text>

              <Text style={contactInfo}>
                <strong>이메일:</strong> contact@lodgex.com<br />
                <strong>전화:</strong> 02-1234-5678<br />
                <strong>운영시간:</strong> 평일 09:00 - 18:00
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={footerSection}>
              <Text style={footerText}>
                LodgeX 호텔 컨설팅 서비스를 선택해 주셔서 감사합니다.<br />
                호텔 운영의 새로운 가능성을 함께 만들어 나가겠습니다.
              </Text>
              
              <Text style={signature}>
                LodgeX 컨설팅팀 드림
              </Text>
            </Section>
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
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const headerSection = {
  textAlign: 'center' as const,
  padding: '20px',
  backgroundColor: '#1C2A44',
};

const h1 = {
  color: '#D4B98B', // Gold color
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '40px',
  margin: '0',
  textAlign: 'center' as const,
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
};

const contentSection = {
  padding: '0 20px',
};

const h2 = {
  color: '#1C2A44',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '20px 0 16px 0',
};

const h3 = {
  color: '#1C2A44',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '16px 0 12px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '12px 0',
};

const summarySection = {
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '8px',
  margin: '20px 0',
};

const infoRow = {
  margin: '8px 0',
};

const labelColumn = {
  width: '100px',
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
  margin: '2px 0',
};

const nextStepsSection = {
  margin: '20px 0',
};

const stepText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '12px 0',
  paddingLeft: '8px',
  borderLeft: '3px solid #D4B98B',
};

const contactSection = {
  margin: '20px 0',
};

const contactText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const contactInfo = {
  color: '#1C2A44',
  fontSize: '14px',
  lineHeight: '20px',
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '4px',
  margin: '12px 0',
};

const footerSection = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const footerText = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '12px 0',
  textAlign: 'center' as const,
};

const signature = {
  color: '#1C2A44',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};