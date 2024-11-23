import JSEncrypt from 'jsencrypt'

const encrypt = new JSEncrypt()
encrypt.setPublicKey(import.meta.env.VITE_RSA_PUBLIC_KEY)

console.log(import.meta.env.VITE_RSA_PUBLIC_KEY)

export const rsaEncrypt = (data: string) => {
  return encrypt.encrypt(data)
}
