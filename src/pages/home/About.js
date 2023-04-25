import React from 'react'
import { useSites } from 'context/sites-provider'

const About = () => {
  const {  currentSite } = useSites()
  const eckerleUrl = 'https://n.hirmercdn.de/eck/content/teasers/startseite/STS_20230406/20230405-newin-dsk.jpg'

  console.log('currentSite', currentSite);

  function aboutVariant (site) {
    switch (site) {
      case 'ECK':
        return (
          <div className='home_about__eck flex items-center justify-center'>
            <div className="flex items-center justify-center">
              <img src={eckerleUrl} className="" alt='eckler'/>
            </div>  
          </div>
        )
      
      case 'main':
        return (
          <div className='home-about-hirmer'>
            <div class="home-about-hirmer__teaser"> 
               <img src="https://n.hirmercdn.de/hrm/content/teasers/startseite/STS_20230406/20230405_hir_sts_jacken.jpg" alt="hirmer"/>
            </div>

            <div class="home-about-hirmer__teaser">
              <img src="https://n.hirmercdn.de/hrm/content/teasers/startseite/STS_20230421/20230421_hir_sts_lacoste-netflix.jpg" alt="hirmer"/>
            </div>
          </div>
        )

      
      default:
        break;
    }


  }

  return ( 
      aboutVariant(currentSite)
  )
}

export default About
