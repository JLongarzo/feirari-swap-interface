import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import {
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Box,
  Spacer,
} from "@chakra-ui/layout";
import { formatEther, formatUnits, parseEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { TOKEN_ADDRESSES } from "../../constants";
import { BigNumber } from "ethers";
import useTokenBalance from "hooks/useTokenBalance";
import { useTokenData } from "hooks/useTokenData";
import { useMemo, useState } from "react";
import { SWRResponse } from "swr";

import {
  useRageQuitAmount,
  useRageQuitExchangeRate,
} from "hooks/merger/useRageQuit";

const Swap = () => {
  const { account } = useWeb3React();

  const { data: tribeBalance }: SWRResponse<BigNumber, Error> = useTokenBalance(
    account,
    TOKEN_ADDRESSES.TRIBE
  );

  const exchangeRate = useRageQuitExchangeRate();
  const { maxRageQuittableAmount, canRageQuit } = useRageQuitAmount();
  console.log({ exchangeRate, maxRageQuittableAmount, canRageQuit });

  const fei = useTokenData(TOKEN_ADDRESSES.FEI);
  const tribe = useTokenData(TOKEN_ADDRESSES.TRIBE);

  const [tribeInput, setTribeInput] = useState("");

  const feiReceived = useMemo(() => {
    if (!tribeInput || !exchangeRate) return "0";

    return formatUnits(parseEther(tribeInput).mul(exchangeRate), 27);
  }, [tribeInput, exchangeRate]);

  const handleSwap = () => {
    if (!tribeInput || isNaN(parseFloat(tribeInput))) return;
    alert(`Swapping ${formatUnits(parseEther(tribeInput))} TRIBE`);
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      w="100%"
      h="100%"
      flexGrow={1}
      color="white"
    >
      {/* Left side */}
      <VStack
        flexGrow={0}
        h="100%"
        w={{ base: "100%", md: "50%" }}
        spacing="4"
        align="start"
        px={10}
      >
        {/* Box */}
        <Flex
          direction="column"
          w="80%"
          h="400px"
          borderRadius="lg"
          bgGradient="linear-gradient(90deg, rgba(5,53,181,1) 0%, rgba(23,141,207,1) 100%)"
          px={10}
          py={10}
          my="auto"
          mx="auto"
        >
          <Heading> TRIBE-FEI (RageQuit) </Heading>

          <HStack w="100%" align="start" justify="start" my={4}>
            <VStack align="start" bg="">
              <Text>You have:</Text>
              <HStack>
                <Avatar h="100%" boxSize="15px" src={tribe?.logoURL} />
                <Text fontWeight="bold">
                  {parseFloat(
                    formatEther(tribeBalance ?? BigNumber.from(0))
                  ).toFixed(4)}{" "}
                  TRIBE
                </Text>
              </HStack>
            </VStack>
            <Spacer />
            <VStack align="start" bg="">
              <Text>You can ragequit:</Text>
              <HStack>
                <Avatar h="100%" boxSize="15px" src={tribe?.logoURL} />
                <Text fontWeight="bold">
                  {formatEther(maxRageQuittableAmount ?? BigNumber.from(0))}{" "}
                  TRIBE
                </Text>
              </HStack>
            </VStack>
            <Spacer />
          </HStack>

          <VStack align="flex-start" w="100%" mb={4}>
            <InputGroup w="100%">
              <Input
                w="100%"
                size="lg"
                value={tribeInput}
                onChange={({ target: { value } }) => {
                  setTribeInput(value);
                }}
                fontWeight="bold"
                placeholder="TRIBE to swap"
                _placeholder={{
                  fontWeight: "bold",
                }}
              />
              <InputRightElement
                children={
                  <HStack w="100%" mr={"150px"} justify="start" align="center">
                    <HStack>
                      <Avatar h="100%" boxSize="15px" src={tribe?.logoURL} />
                      <Text>TRIBE</Text>
                    </HStack>

                    <Button
                      onClick={() =>
                        setTribeInput(
                          formatEther(tribeBalance ?? BigNumber.from(0))
                        )
                      }
                      background="black"
                      color="white"
                      margin={0}
                      h="30%"
                      p={1}
                    >
                      Max
                    </Button>
                  </HStack>
                }
              />
            </InputGroup>
          </VStack>

          <VStack align="flex-start" w="100%" mb={4}>
            <InputGroup w="100%" size="lg">
              <Input
                w="100%"
                size="lg"
                value={feiReceived}
                placeholder="FEI recieved"
                disabled
                _placeholder={{
                  fontWeight: "bold",
                }}
                fontWeight="bold"
              />
              <InputRightElement
                children={
                  <HStack w="100%" mr={"150px"} justify="start">
                    <Avatar h="100%" boxSize="15px" src={fei?.logoURL} />
                    <Text>FEI</Text>
                  </HStack>
                }
              />
            </InputGroup>
          </VStack>

          <Button
            onClick={handleSwap}
            disabled={!canRageQuit}
            w="100%"
            colorScheme="green"
          >
            Swap TRIBE for FEI
          </Button>
        </Flex>
      </VStack>
      {/* Right Side */}
      <VStack
        w={{ base: "100%", md: "50%" }}
        h="100%"
        flexGrow={0}
        flexShrink={0}
        bg=""
      >
        <Image
          src="https://esquilo.io/png/thumb/wJZCNNoWGoPmnmE-Sad-Pepe-The-Frog-PNG-Transparent-Picture.png "
          w="70%"
          h="70%"
          mx="auto"
          my="auto"
          alt="Sad Pepe"
        />
      </VStack>
    </Flex>
  );
};

export default Swap;
