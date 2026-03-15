export default function Footer() {
  return (
    <footer className="bg-white/5 border-t border-white/10 dark:bg-gray-900/50 backdrop-blur-md">
      <div className="responsive-container py-4 md:py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mb-6 lg:mb-0">
            <a href="/" className="flex items-center">
              <span className="self-center responsive-text-xl md:responsive-text-2xl font-semibold whitespace-nowrap gradient-text">TrendAI</span>
            </a>
            <p className="mt-3 md:mt-4 text-gray-500 dark:text-gray-400 max-w-md responsive-text-sm">
              Discover the most profitable business opportunities in any area using Google and Reddit search analysis powered by AI.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 md:mb-6 responsive-text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-3 md:mb-4">
                  <a href="#" className="hover:underline responsive-text-sm">Blog</a>
                </li>
                <li>
                  <a href="/acquisition-tiers" className="hover:underline responsive-text-sm">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 md:mb-6 responsive-text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-3 md:mb-4">
                  <a href="#" className="hover:underline responsive-text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline responsive-text-sm">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4 md:my-6 lg:my-8 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="responsive-text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2026 <a href="/" className="hover:underline">TrendAI™</a>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
