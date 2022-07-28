import React from "react"
import tic from "./click1.wav"
import tac from "./click2.wav"
import { FaPlay, FaStop } from "react-icons/fa"
import moment from "moment"

import {
  SimpleGrid,
  Text,
  Center,
  Image,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Button,
  Box,
} from "@chakra-ui/react"

class Metronome extends React.Component {
  constructor(props) {
    super(props)

    // inisiasi suara
    this.tic = new Audio(tic)
    this.tac = new Audio(tac)

    this.state = {
      bpm: 100,
      playing: false,
      count: 0,
      seconds: 0,
      time: "00:00:00",
      beatsPerMeasure: 4,
    }
  }

  tick() {
    if (this.state.playing) {
      this.setState((state) => ({
        seconds: state.seconds + 1,
        time: moment.utc(state.seconds * 1000).format("HH:mm:ss"),
      }))
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  handleButton = () => {
    // hapus jam setiap timer dimulai

    // jika status playing maka button berperan sebagai penghenti
    if (this.state.playing) {
      // hapus timer
      this.setState({
        playing: false,
        seconds: 0,
      })
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000)
      this.setState(
        {
          playing: true,
          count: 0,
        },
        this.playClick
      )
    }
  }

  playClick = () => {
    const { count, beatsPerMeasure } = this.state
    if (count % beatsPerMeasure === 0) {
      this.tac.play()
    } else {
      this.tic.play()
    }

    // track beats
    this.setState((state) => ({
      count: (state.count + 1) % state.beatsPerMeasure,
    }))
  }

  handleBpmChange = (val) => {
    if (this.state.playing) {
      clearInterval(this.timer)
      this.timer = setInterval(this.playClick, (60 / val) * 1000)
      this.setState({
        bpm: val,
        count: 0,
      })
    } else {
      this.setState({ bpm: val })
    }
  }

  handleInputChange = (event) => {
    console.log(event.target.value)

    this.setState({
      bpm: event.target.value,
    })
  }
  render() {
    const labelStyles = {
      mt: "5",
      ml: "-2.5",
      fontSize: "sm",
    }
    return (
      <>
        <SimpleGrid columns={1}>
          <Center
            bg={this.state.count % 2 === 0 ? "teal.700" : "teal.600"}
            h="100px"
            color="white"
          >
            <Text fontSize="4xl">The Metronome</Text>
          </Center>
          <Center my="2vh">
            <Box boxSize="200px">
              <Image src="/metro2.jpg" alt="metronome img" />
            </Box>
          </Center>
          <Center mt="10vh">
            <Text fontSize="2xl" mr="1vh">
              BPM{" "}
              <Badge fontSize="xl" variant="outline" colorScheme="green">
                {this.state.bpm}
              </Badge>
            </Text>
          </Center>
          <Center>
            <Slider
              mt="2vh"
              maxW="50%"
              value={this.state.bpm}
              onChange={(val) => this.handleBpmChange(val)}
              min={60}
              max={240}
            >
              <SliderMark {...labelStyles} value={60}>
                60
              </SliderMark>
              <SliderMark {...labelStyles} value={100}>
                100
              </SliderMark>
              <SliderMark {...labelStyles} value={150}>
                150
              </SliderMark>
              <SliderMark {...labelStyles} value={200}>
                200
              </SliderMark>
              <SliderMark {...labelStyles} value={240}>
                240
              </SliderMark>
              <SliderTrack bg="teal.500">
                <SliderFilledTrack bg="teal.800" />
              </SliderTrack>
              <SliderThumb boxSize={6} bg="teal.800" />
            </Slider>
          </Center>
          <Center mt="7vh">
            <Button
              leftIcon={this.state.playing ? <FaStop /> : <FaPlay />}
              onClick={this.handleButton}
              colorScheme="teal"
              variant="solid"
            >
              {this.state.playing ? this.state.time : "Start"}
            </Button>
          </Center>
        </SimpleGrid>
      </>
    )
  }
}

export default Metronome
