import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { css } from '@emotion/css'
import { useRouter } from 'next/router'
import { AppContext } from '../context'
import Modal from '../components/CreatePostModal'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(null)
  const [userAddress, setUserAddress] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState()
  const router = useRouter()

  return (
    <ChakraProvider>
    <AppContext.Provider value={{
      connected,setConnected,
      userAddress,setUserAddress,
      profile: userProfile,setUserProfile
    }}>
      <Layout>
              {/* {
                connected && (
                  <button
                    className={modalButtonStyle}
                    onClick={() => setIsModalOpen(true)}>
                    <img
                      src="/create-post.svg"
                      className={createPostStyle}
                    />
                  </button>
                )
              } */}
        
        <div className={appLayoutStyle}>
          <Component {...pageProps} />
        </div>
        {
          isModalOpen && (
            <Modal
              setIsModalOpen={setIsModalOpen}
            />
          )
        }
      </Layout>
    </AppContext.Provider>
  </ChakraProvider>
  )
}

const appLayoutStyle = css`
  width: 900px;
  margin: 0 auto;
  padding: 78px 0px 50px;
`
 

export default MyApp
