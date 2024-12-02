import styled from "styled-components";
import profile from "./Items/profile.jpeg";
import { motion } from 'framer-motion';
import { forwardRef } from "react";

const Intro = forwardRef((props, ref) => {
  const introArr = [
    { icon: <i class="fas fa-user-tag"></i>, title: "이름", content: "김태훈" },
    { icon: <i class="fas fa-birthday-cake"></i>, title: "생년월일", content: "01.05.30" },
    { icon: <i class="fa-solid fa-phone"></i>, title: "연락처", content: "010-3343-8636" },
    { icon: <i class="fa-solid fa-envelopes-bulk"></i>, title: "이메일", content: "pyoneng_@naver.com" },
  ];

  const list = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const items = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  function handleViewResume(){
    window.open("https://taehun2123.notion.site/Taehun-14b0b4f1603a80faa51cfca9eeded39a", "_blank");
  }

  return (
    <section ref={ref} style={{ padding: "7em 0", overflowX: 'hidden' }}>
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
          <LinkBox>
            <IntroLink onClick={()=> handleViewResume()}>이력서 열람하기</IntroLink>
          </LinkBox>
        </LeftSideBox>
        <RightSideBox>
          <IntroListContainer variants={list} initial="hidden" animate="visible">
            {introArr.map((item, index) => (
              <IntroListBox key={index} variants={items}>
                <Icon>{item.icon}</Icon>
                <DescriptionBox>
                  <DescriptionTitle>{item.title}</DescriptionTitle>
                  <Description>{item.content}</Description>
                </DescriptionBox>
              </IntroListBox>
            ))}
          </IntroListContainer>
        </RightSideBox>
      </Container>
    </section>
  );
})

export default Intro;


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
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
`;

const LeftSideBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
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

const LinkBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
`

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
  &:hover {
    background: var(--button-hover-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const RightSideBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

const IntroListContainer = styled(motion.ul)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  gap: 1em;
  flex: 1;
  padding: 0 1em;
`;

const IntroListBox = styled(motion.li)`
  min-width: 100%;
  background-color: var(--background-main-color);
  border-radius: 1em;
  min-height: 10vh;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1em;
  transition: all 0.5s;
  &:hover {
    background: var(--background-sub-color);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Icon = styled.div`
  width: 100%;
  font-size: 2em;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DescriptionBox = styled.div`
  width: 100%;
  flex: 2;
  display: flex;
  flex-direction: column;
  justifty-content: flex-start;
  align-items: flex-start;
  gap: 0.5em;
`;

const DescriptionTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 750;
`;

const Description = styled.div`
  font-size: 1rem;
`;
