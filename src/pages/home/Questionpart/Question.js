import React from "react";

const Question = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-blue-500 text-gray-900">
      <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8 ">
        <h2 className="text-2xl font-semibold sm:text-4xl text-center text-white">
          আপনার প্রশ্নের উত্তর এখানে খুঁজুন
        </h2>
        <p className="mt-4 mb-8 text-gray-200 text-center">
          আপনার যে কোনো প্রশ্নের উত্তর খুঁজে বের করুন।
        </p>
        <div className="space-y-4 ">
          <details className="w-full border rounded-lg bg-cyan-200">
            <summary className="px-4 py-6 focus:outline-none focus-visible:ring-lime-600 text-gray-800">
              শিক্ষা ব্যবস্থা কেমন?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-gray-800">
              <span className="font-bold">1) </span>
              মানসম্মত শিক্ষা ও প্রশিক্ষণ প্রদান।
              <br />
              <span className="font-bold">2) </span>
              দক্ষ মিড লেভেল প্রফেশনাল ইঞ্জিনিয়ার তৈরি করা।
              <br />
              <span className="font-bold">3) </span>
              আইসিটি শিক্ষা ও প্রশিক্ষণের মাধ্যমে শহুরে ও গ্রামীণ জনগণের মধ্যে
              ডিজিটাল বিভাজন হ্রাস করা।
              <br />
              <span className="font-bold">4) </span>
              আইসিটি ক্ষেত্রে শিল্পে সহায়তা প্রসারিত করা।
              <br />
              <span className="font-bold">5) </span>
              আইসিটি ক্ষেত্রে দেশের পাশাপাশি বিদেশে কর্মসংস্থানযোগ্য দক্ষ
              জনশক্তি সরবরাহ করা।
              <br />
              <span className="font-bold">6) </span>
              আইসিটি ক্ষেত্রে একটি নেতৃস্থানীয় ইনস্টিটিউট কাজ করা।
            </p>
          </details>
          <details className="w-full border rounded-lg bg-cyan-200">
            <summary className="px-4 py-6 focus:outline-none focus-visible:ring-lime-600 text-gray-800">
              এই শিক্ষা প্রতিষ্ঠান কী কারিগরি বোর্ডের অধীনে?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-gray-800">
              ফেনী কম্পিউটার ইনস্টিটিউট গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের শিক্ষা
              মন্ত্রণালয়াধীন কারিগরি ও মাদ্‌রাসা শিক্ষা বিভাগের অধীন কারিগরি
              শিক্ষা অধিদপ্তরের একটি প্রতিষ্ঠান। এটি ফেনী জেলার সদর উপজেলার
              কাজিরবাগ ইউনিয়নের নতুন রানীর হাট এলাকায় অবস্থিত।
            </p>
          </details>
          <details className="w-full border rounded-lg bg-cyan-200">
            <summary className="px-4 py-6 focus:outline-none focus-visible:ring-lime-600 text-gray-800">
              যোগাযোগ করবো কিভাবে?
            </summary>
            <p className="px-4 py-6 pt-0 ml-4 -mt-4 text-gray-800">
              <span className="font-bold">Feni Computer Institute, Feni.</span>
              <br />
              Post -New Ranir Hat, Post Code - 3900
              <br />
              Feni Sadar, Feni.
              <br />
              Phone: 02334472988, 02334473889
              <br />
              Email: fci_bd@yahoo.com
              <br />
              Mobile: +8801716314779 (Principal)
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Question;