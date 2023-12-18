"use client"
import Image from 'next/image'
import ReCAPTCHA from "react-google-recaptcha"
import { verifyCaptcha } from "@/hooks/useRecaptcha"
import { useRef, useState } from "react"
import { toast } from 'react-toastify'
import { verifyUser, validateVote } from '@/hooks/useCheckUser'

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)
  const [serverSelected, setServerSelected] = useState<"Fenix" | "Aegir" | undefined>(undefined)
  const [login, setLogin] = useState<string>("")
  const [validCheck, setValidCheck] = useState<string>("")

  async function handleCaptchaSubmission(token: string | null) {
    // Server function to verify captcha
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false))
  }

  const handleVerifyUser = async () => {
    setLoading(true)
    try {
      if (!isVerified) return toast.error('Prove que não é um robo!');
      if (!serverSelected) return toast.error('Selecione seu servidor');
      if (login.length < 3) return toast.error('Digite seu login!');
      await toast.promise(
        verifyUser(serverSelected as "Fenix" | "Aegir", login),
        {
          pending: 'Buscando Usuário',
          success: 'Usuário encontrado com sucesso',
          error: 'Usuário não encontrado, verifique seus dados!'
        })
      const response = await toast.promise(
        validateVote(login, serverSelected),
        {
          pending: 'Seu voto está sendo validado.',
          success: 'Voto Validade Com Sucesso',
          error: 'Você ja votou hoje, volte amanha!'
        })
      setValidCheck(response.data.idCode)
    }
    catch {
      return console.log("Error")
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative py-16 from-sky-50 to-gray-200">
      <div className="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40">
        <div className="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
          <div className='flex justify-between items-center'>
            <Image
              src="/logo.png"
              alt="Description of the image"
              width={150}
              height={160}
              placeholder="blur"
              blurDataURL="/path/to/blurred/image.jpg"
            />
            <div>
              <Image
                src="/slogan.png"
                alt="Description of the image"
                width={310}
                height={102}
                placeholder="blur"
                blurDataURL="/path/to/blurred/image.jpg"
              />
            </div>
          </div>
          <div className="rounded-xl bg-white shadow-xl">
            {validCheck.length === 0 && (
              <div className="p-6 sm:p-16">
                <div>
                  <div className="space-y-4">
                    <h2 className="mb-8 text-xl text-cyan-900 font-bold text-center">Selecione seu servidor e digite seu login</h2>
                  </div>
                  <div className='flex gap-2'>
                    <button className={`group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                    hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full`}
                      style={{ borderColor: serverSelected === "Fenix" ? "rgb(96 165 250)" : "" }}
                      onClick={() => setServerSelected("Fenix")}
                    >
                      <div className="relative flex items-center space-x-4 justify-center">
                        <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                          Fenix
                        </span>
                      </div>
                    </button>
                    <button className={`group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                    hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full `}
                      style={{ borderColor: serverSelected === "Aegir" ? "rgb(96 165 250)" : "" }}
                      onClick={() => setServerSelected("Aegir")}
                    >
                      <div className="relative flex items-center space-x-4 justify-center">
                        <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                          Aegir
                        </span>
                      </div>
                    </button>
                  </div>
                  <div className="mt-4 grid space-y-4">
                    <input className='group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100' placeholder='Ex: Micka153'
                      onChange={(e: any) => setLogin(e.target.value)}
                    />
                    <div className='flex justify-center'>
                      <ReCAPTCHA
                        sitekey={String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
                        ref={recaptchaRef}
                        onChange={handleCaptchaSubmission}
                      />
                    </div>
                    <button className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                  hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                      onClick={handleVerifyUser}
                      disabled={loading}
                    >
                      <div className="relative flex items-center space-x-4 justify-center">
                        <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                          Votar
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="mt-10 space-y-4 text-gray-600 text-center sm:-mb-8">
                  <p className="text-xs">Ao prosseguir, você concorda com nossos <a href="#" className="underline">Termos de uso</a> e confirme que você leu nosso <a href="#" className="underline">Declaração de privacidade e cookies</a>.</p>
                  <p className="text-xs">Este site é protegido pelo reCAPTCHA e pelo <a href="#" className="underline">Política de privacidade do Google</a> e <a href="#" className="underline">Termos de serviço</a>.</p>
                </div>
              </div>
            )}
            {validCheck.length > 0 && (
              <div className="p-6 sm:p-16">
                <div className="space-y-4">
                  <h2 className="mb-8 text-xl text-cyan-900 font-bold text-center">Selecione o ranking</h2>
                </div>
                <div className="w-full flex justify-center gap-4">
                  <iframe
                    title="Dynamic Embedded Content"
                    width="600"
                    height="100"
                    src={`http://${validCheck}.vote.worldrag.com`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-10 space-y-4 text-gray-600 text-center sm:-mb-8">
                  <p className="text-xs">Vamos verificar seu voto, e seus pontos serão entregues em até 10 minutos.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
