import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, twitterProvider } from '../../db/firebase';
import {
    Image, 
    Button, 
    Flex, 
    VStack,
    Text,
    useToast,
    Link,
} from '@chakra-ui/react';

import { GoogleIcon } from '../../Icons/google';
import { TwitterIcon } from '../../Icons/twitter';


export const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const handleSocialLogin = (provider) => {
        signInWithPopup(auth, provider)
            .then(() => {
                navigate('/home');
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    return (
        <Flex 
            h="100vh" 
            alignItems="center"
            justifyContent="center" 
            background="radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(198,218,194,1) 100%)"
        >
            <VStack p="32px" width="40%" maxWidth="500px" borderRadius="16px" bg="white" alignItems="center">
                <Image height="45px" width="45px" src='burpple.png' alt='Burpple Icon' />
                <Text color="#111111" fontSize="28px" fontWeight="700" mt="-2px" mb="10px">Sign in</Text>
                <Flex flexDir="column" gap="16px" width="100%">
                    <Button 
                        leftIcon={<GoogleIcon />} 
                        border="1px solid #333333"
                        background="#FFFFFF"
                        onClick={() => handleSocialLogin(googleProvider)}
                        borderRadius="40px"
                    >
                        <Text fontFamily="avenir" fontSize="16px" fontWeight="400">Sign in With Google</Text>
                    </Button>
                    <Button 
                        leftIcon={<TwitterIcon />} 
                        border="1px solid #333333"
                        background="#FFFFFF"
                        onClick={() => handleSocialLogin(twitterProvider)}
                        borderRadius="40px"
                    >
                        <Text fontFamily="avenir" fontSize="16px" fontWeight="400">Sign in With Twitter</Text>
                    </Button>
                </Flex>

                <Text mt="16px" fontSize="12px" textAlign="center">
                    By continuing, you agree to the <Link color="#111111" textDecoration="underline">Terms of Service</Link> <br></br>
                    and acknowledge you’ve read our <Link color="#111111" textDecoration="underline">Privacy Policy</Link>. 
                </Text>
            </VStack>
        </Flex>
    );
};
