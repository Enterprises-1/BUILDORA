
import React from 'react';

interface LegalProps {
  type: 'privacy' | 'terms' | 'ethics';
}

const Legal: React.FC<LegalProps> = ({ type }) => {
  const content = {
    privacy: {
      title: "Privacy Policy",
      text: "At Buildora, we take your privacy seriously. We only collect the necessary information to process your build requests and bids. Your data is never sold to third parties and is protected by industry-standard encryption."
    },
    terms: {
      title: "Terms of Service",
      text: "By using our speculative build service, you agree that ownership of the project remains with Buildora until final payment is received. Bids placed on available websites are subject to review and do not constitute a binding contract until accepted."
    },
    ethics: {
      title: "Ethics Statement",
      text: "We believe in honest engineering. No dark patterns, no hidden costs. Our speculative build model is built on mutual trust: we prove our value, and you reward it fairly."
    }
  };

  const { title, text } = content[type];

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-10">{title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 text-xl leading-relaxed">{text}</p>
          <div className="mt-12 space-y-6 text-gray-500">
            <p>Last updated: June 2026</p>
            <p>Buildora Digital Engineering Group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
