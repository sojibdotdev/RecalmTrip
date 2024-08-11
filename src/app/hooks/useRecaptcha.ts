import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const verifyReCaptcha = async (action: string) => {
    if (!executeRecaptcha) {
      return false
    }
    try {
      const { data } = await axios.post('/api/auth/re-captcha', {
        gRecaptchaToken: await executeRecaptcha(action)
      })
      console.log(data)

      return data.success
    } catch (error) {
      return false
    }
  }

  return { verifyReCaptcha }
}
export { useReCaptcha }
