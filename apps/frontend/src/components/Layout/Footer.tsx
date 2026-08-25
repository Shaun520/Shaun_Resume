import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

export default function Footer() {
  return (
    <AntFooter className="text-center text-gray-500 text-sm bg-white border-t border-gray-100 py-4">
      © {new Date().getFullYear()} Shaun Resume — 在线简历制作平台
    </AntFooter>
  )
}
