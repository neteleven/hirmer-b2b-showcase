import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './navigationbar'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useSelector } from 'react-redux'
import { pageMenuSelector } from '../../redux/slices/pageReducer'
import './topbar.css'
import { addTenantToUrl, homeUrl } from '../../services/service.config'
import AlgoliaSearchbar from '../AlgoliaSearchbar'
import { useContentful } from '../../context/contentful-provider'

const Logo = ({ onMouseOver }) => {
  const { fields } = useContentful()

  const [logoUrl, setLogoUrl] = useState('')
  const { companyLogo } = fields

  useEffect(() => {
    ;(async () => {
      if (
        companyLogo &&
        companyLogo.fields &&
        companyLogo.fields.file &&
        companyLogo.fields.file.url
      ) {
        setLogoUrl(companyLogo.fields.file.url)
      }
    })()
  }, [companyLogo])

  return (
    <Link to={homeUrl()} className="lg:ml-[-250px] block" onMouseOver={onMouseOver}>
      <div className="w-[37px]">
        <svg className="fill-black" height="30" viewBox="0 0 109.9 20"><title>Hirmer Logo</title><path d="M19 3.3h1V0h-7.3v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v3.8H5.7V4a.764.764 0 01.2-.5.764.764 0 01.5-.2h1V0H0v3.3h1a.764.764 0 01.5.2c.1.2.2.3.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2H0V20h7.3v-3.3h-1a.684.684 0 01-.7-.7v-4.1h8.7V16c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20H20v-3.3h-1a.684.684 0 01-.7-.7V4c0-.2.1-.3.2-.5a.764.764 0 01.5-.2zM68 7v9c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h7.3v-3.3h-1a.764.764 0 01-.5-.2.9.9 0 01-.1-.5V4c0-.2.1-.3.2-.5a.764.764 0 01.5-.2h1V0H68l-6.3 9.1L55.5 0h-5.7v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h7.3v-3.3h-1a.684.684 0 01-.7-.7V7l6 8.7c0 .1.2.2.3.2s.2-.1.3-.2zM28.5 3.3h1V0h-7.3v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h7.3v-3.3h-1a.684.684 0 01-.7-.7V4a.764.764 0 01.2-.5.764.764 0 01.5-.2zM91.6 0H75.8v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h15.8v-5.3h-3.9V16c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-4.8a.684.684 0 01-.7-.7v-4.1h4.2v-4h-4.2V4a.764.764 0 01.2-.5.764.764 0 01.5-.2H87a.764.764 0 01.5.2.764.764 0 01.2.5v1.3h3.9zM37.4 16.4a.764.764 0 01-.2-.5v-3.2h1.5l4 6.3a1.79 1.79 0 001.4.9h3.7v-3.3h-1.2a1.79 1.79 0 01-1.4-.9l-2.1-3.3a6 6 0 004.6-6.1c0-4.7-3.3-6.3-6.5-6.3h-9.8v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h7.3v-3.3h-1c.1 0-.1-.1-.3-.3zm0-12.9a.764.764 0 01.5-.2H41c1 0 2.6.4 2.6 2.8S42 8.8 41 8.8h-3.8V4c0-.2.1-.3.2-.5zm70 12.2l-2.1-3.3a6 6 0 004.6-6.1c0-4.7-3.3-6.3-6.5-6.3h-9.8v3.3h1a.764.764 0 01.5.2.764.764 0 01.2.5v12c0 .2-.1.3-.2.5a.764.764 0 01-.5.2h-1V20h7.3v-3.3h-1a.684.684 0 01-.7-.7v-3.2h1.5l4 6.3a1.79 1.79 0 001.4.9h3.7v-3.3h-1.2c-.7 0-1.2-.9-1.2-1zm-4.2-6.9h-3.8V4a.764.764 0 01.2-.5.764.764 0 01.5-.2h3.1c1 0 2.6.4 2.6 2.8a2.409 2.409 0 01-2.6 2.7z"></path></svg>
      </div>
    </Link>
  )
}

const MegaNav = ({ showMegaMenuContent, setShowMegaMenuContent }) => {
  const [subMenuItems, setSubMenuItems] = useState([])
  const [showMegaMenuRightContent, setShowMegaMenuRightContent] =
    useState(false)
  const [subMenuMegaContent, setSubMenuMegaContent] = useState([])
  const onShowMegaMenu = () => setShowMegaMenuContent(true)
  const overMenuItem = (items) => {
    setSubMenuItems(items)
    if (!showMegaMenuContent) setShowMegaMenuContent(true)
  }
  const hideMegaMenuContent = () => {
    setShowMegaMenuContent(false)
  }
  const menuList = useSelector(pageMenuSelector)

  const { fields } = useContentful()
  return (
    <div className="dropdown flex text-base">
      {menuList.map((item, index) => (
        <button
          key={index}
          className="mega_menu_dropbtn"
          onMouseOver={() =>
            item.items.length !== 0
              ? overMenuItem(item.items)
              : hideMegaMenuContent()
          }
        >
          <Link to={!item.items.length ? addTenantToUrl(item.url) : homeUrl}>
            <div className="text-base uppercase text-black font-bold">
              {' '}
              {item.contentfulFieldName
                ? fields[item.contentfulFieldName]
                : item.title}
            </div>
          </Link>

          <ChevronDownIcon
            className={item.items.length ? 'ml-2 mt-1 h-5 w-5' : 'hidden'}
            aria-hidden="true"
          />
        </button>
      ))}
      {showMegaMenuContent ? (
        <div
          className="header-mega_dropdown-content"
          onMouseEnter={onShowMegaMenu}
          onClick={() => setShowMegaMenuContent(false)}
        >
          <div className="row w-full h-full flex">
            <div className="h-full w-[24%] mega_content_bg">
              <div className="pl-[72px] pt-[72px] overflow-y-auto max-h-full">
                <ul className=" text-black text-base font-bold">
                  {subMenuItems.map((item, index) => (
                    <Link replace key={index} to={addTenantToUrl(item.url)}>
                      <li
                        className="mega_content_category_li"
                        onMouseOver={() => {
                          setSubMenuMegaContent(item.items)
                          setShowMegaMenuRightContent(true)
                        }}
                        onMouseLeave={() => {
                          setShowMegaMenuRightContent(false)
                        }}
                      >
                        {item.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className="h-full w-[76%] grid grid-cols-4 overflow-y-auto gap-4 pl-[72px] pt-[72px] max-h-full"
              onMouseOver={() => setShowMegaMenuRightContent(true)}
            >
              {showMegaMenuRightContent
                ? subMenuMegaContent.map((item) => (
                    <div key={item.categoryId}>
                      <ul className=" text-black text-base">
                        <Link to={addTenantToUrl(item.url)}>
                          <li className="mega_content_sub_cat_li font-bold">
                            {item.title}
                          </li>
                        </Link>
                        {item.items.map((eachItem) => (
                          <Link
                            key={eachItem.categoryId}
                            to={addTenantToUrl(eachItem.url)}
                          >
                            <li className="mega_content_sub_cat_li">
                              {eachItem.title}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const TopNav = ({ title }) => {
  const nav_title_condition = title !== '' && title !== 'home' ? true : false
  const [showMegaMenuContent, setShowMegaMenuContent] = useState(false)

  return (
    <div
      className={
        title === 'home'
          ? 'desktop_only_flex w-full md:h-36 absolute z-10'
          : title === ''
          ? 'nav-background-title desktop_only_flex h-36'
          : 'desktop_only_flex w-full md:h-60 absolute z-10 nav-background-title'
      }
    >
      <div className="px-10 pt-[76px] w-full xl:px-24  h-36">
        <div
          className="menu-wrapper w-full border-b-[1px] border-black"
          onMouseLeave={() => {
            setShowMegaMenuContent(false)
          }}
        >
          <div className="m-auto flex items-center justify-center">
          <div
              className="hidden lg:flex justify-start"
              onMouseOver={() => setShowMegaMenuContent(false)}
            >
              <AlgoliaSearchbar />
            </div>

            <div className="m-auto">
              <Logo onMouseOver={() => setShowMegaMenuContent(false)} />
            </div>
          </div>

          <div className="w-full h-12 flex items-center justify-center">

            <MegaNav
              showMegaMenuContent={showMegaMenuContent}
              setShowMegaMenuContent={setShowMegaMenuContent}
            />
          </div>
        </div>
      </div>
      {nav_title_condition && (
        <div className=" md:absolute mt-[176px] ml-24 text-black font-inter font-bold text-[32px]">
          {title}
        </div>
      )}
    </div>
  )
}

const Topbar = ({ title }) => {
  return (
    <>
      <Navbar />
      <TopNav title={title} />
    </>
  )
}

export default Topbar
