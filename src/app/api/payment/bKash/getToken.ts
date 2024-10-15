import axios from 'axios'

const getToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.BKASH_BASE_URL}/checkout/token/grant`,
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          username: process.env.BKASH_USERNAME,
          password: process.env.BKASH_PASSWORD
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error creating TOKEN')
  }
}
export { getToken }
