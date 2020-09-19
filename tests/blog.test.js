const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe('While logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    it('should see blog create form', async () => {
    
        const label = await page.getContentsOf('form label');
    
        expect(label).toEqual('Blog Title');
    });

    describe('and using invalid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My title');
            await page.type('.content input', 'My content');
            await page.click('form button');
        });

        it('submiting takes user to review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        
        it('submiting takes user to review screen', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('My title');
            expect(content).toEqual('My content');
        });
    });

    describe('and using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        it('form shoul show an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contenError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contenError).toEqual('You must provide a value');
        });
    });
});

describe('user is not logged in', async () => {
    it.only('user cannot create blog posts', async () => {
        const result = await page.post('api/blogs', {title: 'My Title', content: 'My Content'});
        
        expect(result).toEqual({ error: 'You must log in!' });
    });

    it('user should not get a list of posts', async () => {
        const result = await page.get('api/blogs');

        expect(result).toEqual({ error: 'You must log in!' });
    });
});