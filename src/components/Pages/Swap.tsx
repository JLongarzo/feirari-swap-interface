import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
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
  Center,
} from "@chakra-ui/layout";
import { formatEther, formatUnits, parseEther } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import useTokenBalance from "hooks/useTokenBalance";
import { useTokenData } from "hooks/useTokenData";
import { useMemo, useState } from "react";
import { SWRResponse } from "swr";

import { usePegExchangeRate } from "hooks/merger/usePegExchangeRate";
import { usePegExchangeSwap } from "hooks/merger/usePegExchangeSwap";
import { TOKEN_ADDRESSES } from "../../constants";
const Swap = () => {
  const { account } = useWeb3React();

  const { data: rgtBalance, mutate }: SWRResponse<BigNumber, Error> =
    useTokenBalance(account, TOKEN_ADDRESSES.RGT);

  const { data: tribeBalance }: SWRResponse<BigNumber, Error> = useTokenBalance(
    account,
    TOKEN_ADDRESSES.TRIBE
  );

  const rgt = useTokenData(TOKEN_ADDRESSES.RGT);
  const tribe = useTokenData(TOKEN_ADDRESSES.TRIBE);

  const [rgtInput, setRgtInput] = useState("");

  const exchangeRate = usePegExchangeRate();
  const { swap, swapStep } = usePegExchangeSwap();

  const tribeReceived = useMemo(() => {
    if (!rgtInput || !exchangeRate) return "0";

    return formatUnits(parseEther(rgtInput).mul(exchangeRate), 27);
  }, [rgtInput, exchangeRate]);

  const handleSwap = async () => {
    if (!rgtInput || isNaN(parseFloat(rgtInput))) return;
    // alert(
    //   `Swapping ${formatUnits(
    //     parseEther(rgtInput)
    //   )} RGT for ${tribeReceived} TRIBE`
    // );
    await swap(parseEther(rgtInput));
    mutate();
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
        id="POOP"
        px={10}
      >
        {/* Box */}
        <Flex
          direction="column"
          w="80%"
          h="400px"
          // border="1px solid grey"
          borderRadius="lg"
          px={10}
          py={5}
          my="auto"
          mx="auto"
          bgGradient="linear-gradient(90deg, rgba(5,53,181,1) 0%, rgba(23,141,207,1) 100%)"
        >
          <Heading> Swap RGT for TRIBE </Heading>

          <HStack w="100%" align="start" justify="start" my={1}>
            <VStack align="start" bg="" my={4} mb={8}>
              <Text>You have:</Text>
              <HStack>
                <Avatar h="100%" boxSize="15px" src={rgt?.logoURL} />
                <Text fontWeight="bold">
                  {formatEther(rgtBalance ?? BigNumber.from(0))} RGT
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack align="flex-start" w="100%">
            <InputGroup w="100%">
              <Input
                w="100%"
                size="lg"
                value={rgtInput}
                onChange={({ target: { value } }) => {
                  setRgtInput(value);
                }}
                fontWeight="bold"
                placeholder="RGT to swap"
                _placeholder={{
                  fontWeight: "bold",
                }}
              />
              <InputRightElement
                children={
                  <HStack w="100%" mr={"150px"} justify="start" align="center">
                    <HStack>
                      <Avatar h="100%" boxSize="15px" src={rgt?.logoURL} />
                      <Text>RGT</Text>
                    </HStack>

                    <Button
                      onClick={() =>
                        setRgtInput(
                          formatEther(rgtBalance ?? BigNumber.from(0))
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

          <Center w="100%" my={3}>
            <ArrowDownIcon />
          </Center>

          <VStack align="flex-start" w="100%" mb={4}>
            <InputGroup w="100%" size="lg">
              <Input
                w="100%"
                size="lg"
                value={tribeReceived}
                placeholder="TRIBE recieved"
                disabled
                _placeholder={{
                  fontWeight: "bold",
                }}
                fontWeight="bold"
              />
              <InputRightElement
                children={
                  <HStack w="100%" mr={"150px"} justify="start" align="center">
                    <Avatar h="100%" boxSize="15px" src={tribe?.logoURL} />
                    <Text>TRIBE</Text>
                  </HStack>
                }
              />
            </InputGroup>
          </VStack>

          <Button
            onClick={handleSwap}
            w="100%"
            colorScheme="green"
            disabled={!!swapStep}
          >
            {swapStep === "APPROVING"
              ? "Approving RGT..."
              : swapStep === "SWAPPING"
              ? "Exchanging RGT..."
              : "Swap RGT for TRIBE"}
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
          src="https://ih1.redbubble.net/image.981192734.2546/st,small,507x507-pad,600x600,f8f8f8.jpg"
          w="70%"
          h="70%"
          mx="auto"
          my="auto"
          alt="Happy Pepe"
        />
      </VStack>
    </Flex>
  );
};

export default Swap;
