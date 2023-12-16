"use client"
import Image from 'next/image'
import ReCAPTCHA from "react-google-recaptcha"
import { verifyCaptcha } from "@/hooks/useRecaptcha"
import { useRef, useState } from "react"
import { toast } from 'react-toastify'
import { verifyUser } from '@/hooks/useCheckUser'

export default function Home() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsverified] = useState<boolean>(false)
  const [serverSelected, setServerSelected] = useState<"Fenix" | "Aegir" | undefined>(undefined)
  const [login, setLogin] = useState<string>("")

  async function handleCaptchaSubmission(token: string | null) {
    // Server function to verify captcha
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false))
  }

  const notify = () => toast("Wow so easy !");

  const handleVerifyUser = async () => {
    if (!serverSelected) return toast.error('Selecione seu servidor');
    await toast.promise(
      verifyUser(serverSelected as "Fenix" | "Aegir", login),
      {
        pending: 'Buscando Usuário',
        success: 'Usuário encontrado com sucesso',
        error: 'Usuário não encontrado, verifique seus dados!'
      })
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
            <div className="p-6 sm:p-16">
              <div>
                <div className="space-y-4">
                  <h2 className="mb-8 text-xl text-cyan-900 font-bold text-center">Selecione seu servidor e digite seu login</h2>
                </div>
                <div className='flex gap-2'>
                  <button className={`group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                    hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full ${serverSelected === "Fenix" && "border-blue-400"}`}
                    onClick={() => setServerSelected("Fenix")}
                  >
                    <div className="relative flex items-center space-x-4 justify-center">
                      <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                        Fenix
                      </span>
                    </div>
                  </button>
                  <button className={`group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                    hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100 w-full ${serverSelected === "Aegir" && "border-blue-400"}`}
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
                  <form>
                    <ReCAPTCHA
                      sitekey={String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
                      ref={recaptchaRef}
                      onChange={handleCaptchaSubmission}
                    />
                  </form>
                  <button className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                  hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                    onClick={handleVerifyUser}
                  >
                    <div className="relative flex items-center space-x-4 justify-center">
                      <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                        Votar
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="mt-32 space-y-4 text-gray-600 text-center sm:-mb-8">
                <p className="text-xs">Ao prosseguir, você concorda com nossos <a href="#" className="underline">Termos de uso</a> e confirme que você leu nosso <a href="#" className="underline">Declaração de privacidade e cookies</a>.</p>
                <p className="text-xs">Este site é protegido pelo reCAPTCHA e pelo <a href="#" className="underline">Política de privacidade do Google</a> e <a href="#" className="underline">Termos de serviço</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
