import React from 'react'
import TeacherCard from './TeacherCard'

const Teacher = () => {

    const CardDate =[
        {
            img:'https://i.ibb.co/Prf8KR2/kb.png',
            name:'Jakir khan',
            subject:'Math',
        },
        {
            img:'https://i.ibb.co/kyD2vNk/jakirhero.jpg',
            name:'Mohammad',
            subject:'English',
        },
        {
            img:'https://i.ibb.co/GMj3kDH/bigcul.jpg',
            name:'Mehemet',
            subject:'Web-Design',
        },
        {
            img:'https://i.ibb.co/X77Qvhy/IMG-20221122-152610.jpg',
            name:'Mustafa',
            subject:'Electonics'
        },
        {
            img:'https://i.ibb.co/Prf8KR2/kb.png',
            name:'Jakir khan',
            subject:'Math',
        },
        {
            img:'https://i.ibb.co/kyD2vNk/jakirhero.jpg',
            name:'Mohammad',
            subject:'English',
        },
        {
            img:'https://i.ibb.co/GMj3kDH/bigcul.jpg',
            name:'Mehemet',
            subject:'Web-Design',
        },
        {
            img:'https://i.ibb.co/X77Qvhy/IMG-20221122-152610.jpg',
            name:'Mustafa',
            subject:'Electonics'
        },
    ]


  return (
    <section className="py-6 bg-slate-200">
	<div className="container flex flex-col items-center justify-center p-4 mx-auto sm:p-10">
		<p className="p-2 text-sm font-medium tracking-wider text-center uppercase">Our Teacher</p>
		<h1 className="text-4xl font-bold leading-none text-center sm:text-5xl">The talented teacher behind the scenes</h1>
        <div className="flex flex-row flex-wrap-reverse justify-center mt-8">
        {
                CardDate.map(card => <TeacherCard
                    key={card.id}
                    card={card}
                ></TeacherCard>)
        }
   </div>
	</div>
</section>
  )
}

export default Teacher