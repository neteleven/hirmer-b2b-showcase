import React, { useEffect, useState } from 'react'
import { useContentful } from '../../context/contentful-provider'
import landingBg from '../../assets/landing_bg.png'
const About = () => {
  const { fields } = useContentful()
  const [introImageUrl, setIntroImageUrl] = useState('')

  const { mainImageRight } = fields

  useEffect(() => {
    ;(async () => {
      if (
        mainImageRight &&
        mainImageRight.fields &&
        mainImageRight.fields.file &&
        mainImageRight.fields.file.url
      ) {
        setIntroImageUrl(mainImageRight.fields.file.url)
      }
    })()
  }, [mainImageRight])

  return (
    <div
      className="home_about flex items-center justify-center"
    >
      <div className=" bg-purple flex w-1/2 h-48 items-center justify-center">
        <div className="px-6 md:pl-16 pt-[48px] md:pt-[363px]  ">
          <div className="text-[40px] md:text-[56px] font-inter font-semibold leading-[48px] md:leading-[64px]">
            {fields.mainTitle}
          </div>
          <div className="text-[20px] leading-[32px] font-inter font-light pt-[27px] md:max-w-[525px]">
            {fields.companyMission}
          </div>

          <div className="pt-[78px] desktop_only text-sm">
            <button className="px-6 py-4 bg-blue text-white uppercase font-bold transition ease-in-out duration-300 hover:bg-blueHover">
              {fields.startShoppingButtonLabel}
            </button>
          </div>
        </div>
        <img
          src={introImageUrl}
          className=" mt-[60px] hidden xl:block w-[530px] h-[818px] "
        />
      </div>
      
    </div>
  )
}

export default About
