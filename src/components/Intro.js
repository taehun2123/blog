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
          <IntroList className="special">
            (주)성동물산 B2B 쇼핑몰 외주 프로젝트 착수 (Full Stack)
            <ul style={{padding: '0'}}>
              <IntroSubList>
                <i class="far fa-hand-point-right"></i>
                <IntroLink
                  onClick={() =>
                    window.open(
                      "https://github.com/DevSe-project/Sungdong-FrontEnd",
                      "_blank"
                    )
                  }
                >
                  자세히 보기
                </IntroLink>
              </IntroSubList>
            </ul>
          </IntroList>
          <IntroList>ADSP, GA, ISTQB 자격증 취득</IntroList>
          <IntroList>외부업체((주)펩시스) 장학금 선발(1)</IntroList>
        </ul>
        <IntroTitle>2024</IntroTitle>
        <ul>
          <IntroList>외부업체((주)펩시스) 장학금 선발(2)</IntroList>
          <IntroList>
            DevSe(울산대, 영산대, 울과대 연합동아리) 학술 SW 팀장 취임
          </IntroList>
          <IntroList className="special">
            캡스톤 디자인 - 셔틀버스 트래커 프로젝트 착수 (BackEnd)
            <ul style={{padding: '0'}}>
              <IntroSubList>
              <i class="far fa-hand-point-right"></i>{" "}
                <IntroLink
                  onClick={() =>
                    window.open("https://github.com/2024UCapstone", "_blank")
                  }
                >
                  자세히 보기
                </IntroLink>
              </IntroSubList>
            </ul>
          </IntroList>
          <IntroList>
            울과대 튜터링 너랑나랑, DevSe 활동
            <ul>
              <IntroSubList>- 개인 포트폴리오 블로그 만들기 튜터</IntroSubList>
            </ul>
          </IntroList>
        </ul>
      </ul>
    );
  }
  return (
    <section style={{ padding: "7em 0" }}>
      <Banner
        data-aos="fade-up"
        data-aos-anchor-placement="top-center"
        aos-easing="ease-in-sine"
        aos-duration="5000"
      >
        <h1 className="effectFont" style={{ marginBottom: "2.5em" }}>
          <i class="fas fa-kiss-wink-heart"></i> Who am I
        </h1>
      </Banner>
      <Container
        data-aos="fade-down"
        data-aos-anchor-placement="top-center"
        aos-offset="600"
        aos-easing="ease-in-sine"
        aos-duration="1000"
      >
        <LeftSideBox>
          <ImageWrapper />
            <IntroLink>이력서 열람하기</IntroLink>
        </LeftSideBox>
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

const LeftSideBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
`
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

const IntroTitle = styled.li`
  font-size: 20px;
  font-weight: 650;
`;
const IntroList = styled.li`
  padding: 0.5em;
  text-wrap: balance;
`;
const IntroSubList = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;
`;
const IntroLink = styled.button`
  padding: 1em 2em;
  background: var(--button-main-color);
  border-radius: 1em;
  cursor: pointer;
  border: none;
  color: white;
  font-weight: 750;
  text-decoration: underline;
  transition: background 0.5s;
  &:hover{
    background: var(--button-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
