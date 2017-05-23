/**
 * Created by zhengguorong on 2016/11/30.
 */
import { expect } from 'chai'
import mutations from 'src/vuex/article/mutations'
import Article from 'src/model/Article'

describe('article mutations', () => {
  const state = {
    // 文章列表
    list: [],
    // 正在编辑的文章
    editorArticle: {}
  }
  const articleList = []
  const articleOne = new Article()
  const articleTwo = new Article()
  articleList.push(articleOne)
  articleList.push(articleTwo)

  it('获取文章列表', () => {
    mutations.GET_ARTICLE_LIST(state, articleList)
    expect(state.list.length).to.equal(2)
  })
  it('文章列表倒序获取', () => {
    expect(state.list[0]).to.equal(articleTwo)
  })
  it('添加文章', () => {
    let oldLength = state.list.length
    mutations.ADD_ARTICLE(state, new Article())
    expect(state.list.length).to.equal(oldLength + 1)
  })
  it('设置正在编辑文章', () => {
    mutations.SET_EDITOR_ARTICLE(state, articleOne)
    expect(state.editorArticle).to.equal(articleOne)
  })
})
