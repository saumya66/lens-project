import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { css } from '@emotion/css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createClient, STORAGE_KEY, authenticate as authenticateMutation, getChallenge, getDefaultProfile } from '../api'
import { parseJwt, refreshAuthToken } from '../utils'
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

const linkTextStyle = css`
  margin-right: 40px;
  font-weight: 600;
  font-size: 15px;
`

const iconStyle = css`
  height: 35px;
  margin-right: 40px;
`

const modalButtonStyle = css`
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
`

const createPostStyle = css`
  height: 35px;
  margin-right: 5px;
`

const navStyle = css`
  background-color: white;
  padding: 15px 30px;
  display: flex;
  position: fixed;
  width: 100%;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid #ededed;
`

const navContainerStyle = css`
  width: 900px;
  margin: 0 auto;
  display: flex;
`

const linkContainerStyle = css`
  display: flex;
  align-items: center;
`

const buttonContainerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`

const buttonStyle = css`
  border: none;
  outline: none;
  margin-left: 15px;
  background-color: black;
  color: #340036;
  padding: 13px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(249, 92, 255);
  transition: all .35s;
  width: 160px;
  letter-spacing: .75px;
  &:hover {
    background-color: rgba(249, 92, 255, .75);
  }
`

export default MyApp
