import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import AdBanner from './components/Layout/AdBanner'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Finance Tools
import PercentageCalculator from './pages/tools/PercentageCalculator'
import LoanCalculator from './pages/tools/LoanCalculator'
import CompoundInterest from './pages/tools/CompoundInterest'
import BMICalculator from './pages/tools/BMICalculator'
import AgeCalculator from './pages/tools/AgeCalculator'
import TipCalculator from './pages/tools/TipCalculator'

// Developer Tools
import JsonFormatter from './pages/tools/JsonFormatter'
import Base64Tool from './pages/tools/Base64Tool'
import UrlEncoderDecoder from './pages/tools/UrlEncoderDecoder'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import HashGenerator from './pages/tools/HashGenerator'
import UuidGenerator from './pages/tools/UuidGenerator'
import JwtDecoder from './pages/tools/JwtDecoder'
import RegexTester from './pages/tools/RegexTester'

// Text Tools
import WordCounter from './pages/tools/WordCounter'
import TextCaseConverter from './pages/tools/TextCaseConverter'
import LoremIpsum from './pages/tools/LoremIpsum'
import TextDiff from './pages/tools/TextDiff'
import MarkdownPreview from './pages/tools/MarkdownPreview'

// Converters
import UnitConverter from './pages/tools/UnitConverter'
import ColorConverter from './pages/tools/ColorConverter'
import NumberBaseConverter from './pages/tools/NumberBaseConverter'
import TimezoneConverter from './pages/tools/TimezoneConverter'

// Generators
import QrCodeGenerator from './pages/tools/QrCodeGenerator'
import RandomNumber from './pages/tools/RandomNumber'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <AdBanner position="top" />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Finance */}
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/compound-interest" element={<CompoundInterest />} />
            <Route path="/tools/bmi-calculator" element={<BMICalculator />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            {/* Developer */}
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/url-encoder" element={<UrlEncoderDecoder />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            {/* Text */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/text-case" element={<TextCaseConverter />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/markdown-preview" element={<MarkdownPreview />} />
            {/* Converters */}
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/number-base" element={<NumberBaseConverter />} />
            <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
            {/* Generators */}
            <Route path="/tools/qr-code" element={<QrCodeGenerator />} />
            <Route path="/tools/random-number" element={<RandomNumber />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <AdBanner position="bottom" />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
