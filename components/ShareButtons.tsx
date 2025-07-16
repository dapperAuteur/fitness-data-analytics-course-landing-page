"use client"

import React, { useState, useEffect } from 'react'
import { Linkedin, Facebook, Mail } from 'lucide-react';
import { LinkedinShareButton, FacebookShareButton, EmailShareButton, BlueskyShareButton } from 'react-share';

// const shareUrl = "YOUR_WEBSITE_URL"; // IMPORTANT: Replace with your actual URL
const shareTitle = "Foundations of Fitness and Health Metrics Course";
const hashtag = "#FitnessAnalytics";

function ShareButtons() {

    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window !== 'undefined') {
        setCurrentUrl(window.location.href);

    console.log('useEffect currentUrl :>> ', currentUrl);
    }
    }, []);
    console.log('currentUrl :>> ', currentUrl);
  return (
      <div className="flex justify-center gap-4">
          <LinkedinShareButton url={currentUrl} title={shareTitle}>
              <Linkedin className="w-8 h-8 text-blue-700 hover:opacity-80" />
          </LinkedinShareButton>
          <FacebookShareButton url={currentUrl} hashtag={hashtag}>
              <Facebook className="w-8 h-8 text-blue-600 hover:opacity-80" />
          </FacebookShareButton>
          <EmailShareButton url={currentUrl} subject={shareTitle} body="Check out this course on Fitness and Health Metrics:">
              <Mail className="w-8 h-8 text-gray-600 hover:opacity-80" />
          </EmailShareButton>
      </div>
  )
}

export default ShareButtons