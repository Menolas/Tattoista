const FaqItem = require('../models/FaqItem')
const Category = require("../models/Category");

class faqController {

  async getFaqItems(req, res) {
    try {
      const faqItems = await FaqItem.find()
      res.json(faqItems)
    } catch (e) {
      console.log(e)
    }
  }

  async addFaqItem(req, res) {
    const faqItem = new FaqItem({
      question: req.body.question,
      answer: req.body.answer
    })

    const results = {}

    try {
      await faqItem.save()
      results.resultCode = 0
      results.faqItems = await FaqItem.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async updateFaqItem(req, res) {
    res.faqItem.question = req.body.question
    res.faqItem.answer = req.body.answer

    const results = {}

    try {
      await res.faqItem.save()
      results.resultCode = 0
      results.faqItems = await FaqItem.find()
      res.status(201).json(results)
    } catch (err) {
      console.log(err)
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async deleteFaqItem(req, res) {
    const results = {}

    try {
      await res.faqItem.remove()
      results.resultCode = 0
      results.faqItems = await FaqItem.find()
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }
}

module.exports = new faqController()
