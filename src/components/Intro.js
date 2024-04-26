import styled from "styled-components"

export function Intro(){
  return(
    <section style={{margin: '10em 0'}}>
      <Banner data-aos="fade-up" data-aos-anchor-placement="top-center" aos-easing="ease-in-sine" aos-duration="5000">
        <h1>Introduce DEVH</h1>
      </Banner>

    </section>
  )
}


const Banner = styled.div`
width: 100%;
height: 10vh;
display: flex;
flex-direction: row;
align-items: center;
justify-content: center;
font-size: 80px;
`