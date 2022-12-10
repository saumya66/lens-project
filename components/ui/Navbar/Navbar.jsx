import Logo from '../../icons/Logo';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { useEffect } from 'react';
import { parseJwt, refreshAuthToken } from '../../../utils';
import { ethers } from 'ethers';
import { STORAGE_KEY,createClient,authenticate as authenticateMutation,getChallenge, getDefaultProfile  } from '../../../api';



const NAV_ITEMS  = [
  {
    label: 'home',
    href: '/'
  },
  {
    label : 'explore profiles',
    href : '/profiles'
  },
  {
    label : 'profile',
    href : `/profile`
  }
];

export default function WithSubnavigation({profile,connected,setUserProfile,setConnected, setUserAddress,userAddress}) {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
   
  async function getUserProfile(address) {
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(getDefaultProfile, {
        address
      }).toPromise()
      setUserProfile(response.data.defaultProfile)
    } catch (err) {
      console.log('error fetching user profile...: ', err)
    }
  }
  async function signIn() {
    try {
      const accounts = await window.ethereum.send(
        "eth_requestAccounts"
      )
      setConnected(true)
      const account = accounts.result[0]
      setUserAddress(account)
      const urqlClient = await createClient()
      const response = await urqlClient.query(getChallenge, {
        address: account
      }).toPromise()
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const signature = await signer.signMessage(response.data.challenge.text)
      const authData = await urqlClient.mutation(authenticateMutation, {
        address: account, signature
      }).toPromise()
      const { accessToken, refreshToken } = authData.data.authenticate
      const accessTokenData = parseJwt(accessToken)
      getUserProfile(account)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accessToken, refreshToken, exp: accessTokenData.exp
      }))
    } catch (err) {
      console.log('error: ', err)
    }
  }
  async function listenForRouteChangeEvents() {
    router.events.on('routeChangeStart', () => {
      refreshAuthToken()
    })
  }
  useEffect(() => {
    refreshAuthToken()
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(
        (window).ethereum
      )
      const addresses = await provider.listAccounts();
      console.log("logged in address: ", addresses)
      if (addresses.length) {
        setConnected(true)
        setUserAddress(addresses[0])
        getUserProfile(addresses[0])
      } else {
        console.log('hit')
        setConnected(false)
      }
    }
    checkConnection()
    listenForRouteChangeEvents()
  }, [])

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
          <Logo width="36" height="36" />
          <Flex display={{ base: 'none', md: 'flex' }} ml={10} >
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
            {profile && console.log(profile)}
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'lg'}
            fontWeight={600}
            color={'white'}
            bg={'green.500'}
            _hover={{
              bg: 'green.300',
            }}
            onClick ={ !connected && signIn }>
            {
             connected ? `signedin` : "sign in"
            }
          </Button>
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const router = useRouter();
  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                onClick = {()=>router.push(navItem?.href ? navItem.href : '/404')}
                fontSize={'lg'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('purple.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};




// import Link from 'next/link';
// import s from './Navbar.module.css';

// import Logo from 'components/icons/Logo';
// import { useRouter } from 'next/router';
// import { useUser } from 'utils/useUser';
// import { useSupabaseClient } from '@supabase/auth-helpers-react';
// import { ReactNode } from 'react';
 
// const Navbar = () => {
 
//   return (
//     <nav className={s.root}>
//       <a href="#skip" className="sr-only focus:not-sr-only">
//         Skip to content
//       </a>
      
//       {/* <div className="mx-auto max-w-6xl px-6">
//         <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
//           <div className="flex flex-1 items-center">
//             <Link href="/">
//               <a className={s.logo} aria-label="Logo">
//                 <Logo />
//               </a>
//             </Link>
//             <nav className="space-x-2 ml-6 hidden lg:block">
//               <Link href="/">
//                 <a className={s.link}>Pricing</a>
//               </Link>
//               <Link href="/account">
//                 <a className={s.link}>Account</a>
//               </Link>
//             </nav>
//           </div>

//           <div className="flex flex-1 justify-end space-x-8">
//             {user ? (
//               <span
//                 className={s.link}
//                 onClick={async () => {
//                   await supabaseClient.auth.signOut();
//                   router.push('/signin');
//                 }}
//               >
//                 Sign out
//               </span>
//             ) : (
//               <Link href="/signin">
//                 <a className={s.link}>Sign in</a>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div> */}
//     </nav>
//   );
// };

// export default Navbar;
