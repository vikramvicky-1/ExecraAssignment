import PortfolioContent from "../models/PortfolioContent.js"

export const getContent = async (req, res) => {
  console.log('GET /api/content request received');
  try {
    let content = await PortfolioContent.findOne()
    if (!content) {
      // Create default if not exists
      content = await PortfolioContent.create({})
    }
    res.status(200).json(content)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateContent = async (req, res) => {
  try {
    let content = await PortfolioContent.findOne()
    if (!content) {
      content = new PortfolioContent(req.body)
    } else {
      Object.assign(content, req.body)
    }
    await content.save()
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('contentUpdated', content);
    }
    
    res.status(200).json(content)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
