import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import * as SolidIcons from '@fortawesome/free-solid-svg-icons'

const iconMap = {
  faPercent: SolidIcons.faPercent,
  faHouse: SolidIcons.faHouse,
  faChartLine: SolidIcons.faChartLine,
  faWeightScale: SolidIcons.faWeightScale,
  faCakeCandles: SolidIcons.faCakeCandles,
  faReceipt: SolidIcons.faReceipt,
  faCode: SolidIcons.faCode,
  faLock: SolidIcons.faLock,
  faLink: SolidIcons.faLink,
  faKey: SolidIcons.faKey,
  faFingerprint: SolidIcons.faFingerprint,
  faIdCard: SolidIcons.faIdCard,
  faShield: SolidIcons.faShield,
  faMagnifyingGlass: SolidIcons.faMagnifyingGlass,
  faAlignLeft: SolidIcons.faAlignLeft,
  faFont: SolidIcons.faFont,
  faParagraph: SolidIcons.faParagraph,
  faCodeCompare: SolidIcons.faCodeCompare,
  faMarkdown: faMarkdown,
  faRuler: SolidIcons.faRuler,
  faPalette: SolidIcons.faPalette,
  faBinaryIcon: SolidIcons.fa0,
  faClock: SolidIcons.faClock,
  faQrcode: SolidIcons.faQrcode,
  faDice: SolidIcons.faDice,
  // Playground
  faWandMagicSparkles: SolidIcons.faWandMagicSparkles,
  faQuoteRight: SolidIcons.faQuoteRight,
  faFaceGrinSquintTears: SolidIcons.faFaceGrinSquintTears,
  faDharmachakra: SolidIcons.faDharmachakra,
  faAt: SolidIcons.faAt,
  faFlask: SolidIcons.faFlask,
  faMusic: SolidIcons.faMusic,
  faImage: SolidIcons.faImage,
}

export function getIcon(iconName) {
  return iconMap[iconName] || SolidIcons.faWrench
}

export default function ToolCard({ tool }) {
  const icon = getIcon(tool.icon)

  const isExternal = tool.path.startsWith('http')

  const content = (
    <>
      <div className="tool-icon-wrap">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.shortDesc}</p>
      <div className="tool-card-arrow">
        <FontAwesomeIcon icon={faArrowRight} />
      </div>
    </>
  )

  if (isExternal) {
    return (
      <a
        href={tool.path}
        target="_blank"
        rel="noopener noreferrer"
        className="tool-card"
        style={{ '--card-color': tool.color }}
        aria-label={`Open ${tool.name} tool`}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      to={tool.path}
      className="tool-card"
      style={{ '--card-color': tool.color }}
      aria-label={`Open ${tool.name} tool`}
    >
      {content}
    </Link>
  )
}
