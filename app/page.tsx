'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeaturedTiles from '../components/FeaturedTiles'
import GallerySection from '../components/GallerySection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="bg-[#F5F6FC] min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedTiles />
      <GallerySection />
      <Footer />
    </main>
  )
}
