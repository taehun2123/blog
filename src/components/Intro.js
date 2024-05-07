import styled from "styled-components";
import profile from "./Items/profile.jpeg";

export function Intro() {
  function dolist() {
    return (
      <ul>
        <IntroTitle>2023</IntroTitle>
        <ul>
          <IntroList>울산과학대학교 컴퓨터IT학부 입학</IntroList>
          <IntroList>울산과학대학교 컴퓨터IT학부 SW개발 전공</IntroList>
          <IntroList>(주)성동물산 B2B 쇼핑몰 외주 프로젝트 착수</IntroList>
          <IntroList>ADSP, GA, ISTQB 자격증 취득</IntroList>
          <IntroList>(주)펩시스 장학금 선발(1)</IntroList>
          <IntroList>1학년 성적 4.5 마무리</IntroList>
        </ul>
        <IntroTitle>2024</IntroTitle>
        <ul>
          <IntroList>(주)펩시스 장학금 선발(2)</IntroList>
          <IntroList>DevSe(울산대, 영산대, 울과대 연합동아리) 학술 SW 팀장 취임</IntroList>
          <IntroList>캡스톤 디자인 - 버스 트래커 프로젝트 착수</IntroList>
          <IntroList>
            울과대 튜터링 너랑나랑, DevSe 활동
            <ul>
              <li>- 개인 포트폴리오 블로그 만들기 튜터</li>
            </ul>
          </IntroList>
        </ul>
      </ul>
    );
  }
  return (
    <section style={{ margin: "7em 0" }}>
      <Banner
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
        aos-easing="ease-in-sine"
        aos-duration="5000"
      >
        <h1 className="effectFont" style={{marginBottom: '2.5em'}}>Who am I</h1>
      </Banner>
      <Container
        data-aos="fade-down"
        data-aos-anchor-placement="top-center"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1000"
      >
        <ImageWrapper />
        {dolist()}
      </Container>
    </section>
  );
}

// Styled Components Source

const Banner = styled.div`
  width: 100%;
  height: 1vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Container = styled.div`
  width: 100%;
  min-height: 20vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const ImageWrapper = styled.div`
  display: flex;
  alien-items: center;
  width: 400px;
  height: 400px;
  background: url(${profile}) no-repeat 50% 0;
  background-size: cover;
  object-fit: contain;
  overflow: hidden;
  justify-content: center;
  border: 3px dotted lightblue;
`;

const IntroTitle= styled.li`
  font-size: 20px;
  font-weight: 650;
`
const IntroList = styled.li`
  padding: 0.5em;
  text-wrap: balance;
`