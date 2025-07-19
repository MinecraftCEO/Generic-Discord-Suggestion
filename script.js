document.addEventListener('DOMContentLoaded', () => {
    const exampleData = {
        "mainTitle": "General Game Improvement Suggestions",
        "subtitle": "Some ideas for improving gameplay, user-friendliness, and long-term fun.",
        "suggestions": [
            {
                "title": "Quality of Life (QoL) Improvements",
                "desc": "Small changes that make the gaming experience smoother and more enjoyable:",
                "list": "A 'Loot All' button for drops.\nCustomizable UI scale for different screen resolutions.\nAbility to save templates for character builds or gear sets.",
                "emph": "These changes would significantly speed up daily actions."
            },
            {
                "title": "New Endgame Content",
                "desc": "A new challenge for experienced players to keep them engaged:",
                "list": "An __**Endless Dungeon**__ or __**Horde Mode**__ with increasing difficulty and leaderboards.\nWeekly world bosses that require community cooperation.",
                "emph": "Provides a reason for veteran players to stay active and test their gear."
            },
            {
                "title": "Social & Guild Features",
                "desc": "Improvements to strengthen the community and teamwork:",
                "list": "Introduction of a guild system with shared goals and rewards.\nA trading hub or auction house to safely interact with other players.\nIntegrated voice chat for parties.",
                "emph": "Promotes collaboration and makes the game more vibrant for everyone."
            }
        ]
    };

    const mainTitleInput = document.getElementById('main-title');
    const subtitleInput = document.getElementById('subtitle');
    const suggestionsContainer = document.getElementById('suggestions-container');
    const addSuggestionBtn = document.getElementById('add-suggestion-btn');
    const suggestionTemplate = document.getElementById('suggestion-template');
    const previewPanel = document.getElementById('preview');
    const markdownOutput = document.getElementById('markdown-output');
    const copyBtn = document.getElementById('copy-btn');
    const loadExampleBtn = document.getElementById('load-example-btn');

    const applyFormat = (inputEl, tag) => {
        const startTag = tag;
        const endTag = tag;
        const selStart = inputEl.selectionStart;
        const selEnd = inputEl.selectionEnd;
        const text = inputEl.value;
        const selectedText = text.substring(selStart, selEnd);
        inputEl.value = text.substring(0, selStart) + startTag + selectedText + endTag + text.substring(selEnd);
        inputEl.focus();
        if (selectedText) {
            inputEl.setSelectionRange(selStart + startTag.length, selEnd + startTag.length);
        } else {
            inputEl.setSelectionRange(selStart + startTag.length, selStart + startTag.length);
        }
        updateOutput();
    };
    
    const parseMarkdownToHTML = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/</g, '<').replace(/>/g, '>');
    };

    const updateOutput = () => {
        let markdown = '';
        let previewHtml = '';
        const mainTitle = mainTitleInput.value.trim();
        if (mainTitle) {
            markdown += `__**➤ ${mainTitle}**__\n\n`;
            previewHtml += `<p><strong><u>➤ ${parseMarkdownToHTML(mainTitle)}</u></strong></p>`;
        }
        const subtitle = subtitleInput.value.trim();
        if (subtitle) {
            markdown += `*${subtitle}*\n\n`;
            previewHtml += `<p><em>${parseMarkdownToHTML(subtitle)}</em></p>`;
        }
        suggestionsContainer.querySelectorAll('.suggestion-block').forEach(block => {
            const title = block.querySelector('.suggestion-title').value.trim();
            if (!title) return;
            const description = block.querySelector('.suggestion-description').value.trim();
            const listItems = block.querySelector('.suggestion-list').value.trim();
            const emphasis = block.querySelector('.suggestion-emphasis').value.trim();
            let blockMarkdown = `> **➤ ${title}**\n`;
            let blockHtml = `<strong>➤ ${parseMarkdownToHTML(title)}</strong><br>`;
            if (description) {
                blockMarkdown += `> *${description}*\n`;
                blockHtml += `<em>${parseMarkdownToHTML(description)}</em><br>`;
            }
            if (listItems) {
                const items = listItems.split('\n').filter(line => line.trim() !== '');
                items.forEach(item => {
                    const formattedItem = item.trim().startsWith('•') ? item.trim() : `• ${item.trim()}`;
                    blockMarkdown += `> ${formattedItem}\n`;
                    blockHtml += `${parseMarkdownToHTML(formattedItem)}<br>`;
                });
            }
            if (emphasis) {
                blockMarkdown += `> _${emphasis}_\n`;
                blockHtml += `<em>${parseMarkdownToHTML(emphasis)}</em>`;
            }
            markdown += blockMarkdown.trim() + '\n\n';
            previewHtml += `<blockquote>${blockHtml}</blockquote>`;
        });
        markdownOutput.value = markdown.trim();
        previewPanel.innerHTML = previewHtml.trim();
    };

    const addInputListeners = (element) => {
        element.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', updateOutput);
        });
        element.querySelectorAll('.format-btn').forEach(btn => {
            const targetInput = btn.parentElement.nextElementSibling;
            btn.addEventListener('click', () => applyFormat(targetInput, btn.dataset.tag));
        });
    };

    const addSuggestionBlock = () => {
        const clone = suggestionTemplate.content.cloneNode(true);
        const newBlock = clone.querySelector('.suggestion-block');
        newBlock.querySelector('.remove-btn').addEventListener('click', () => {
            newBlock.remove();
            updateOutput();
        });
        suggestionsContainer.appendChild(clone);
        addInputListeners(newBlock);
        return newBlock;
    };

    const loadExample = () => {
        const data = exampleData;
        suggestionsContainer.innerHTML = '';
        mainTitleInput.value = data.mainTitle || '';
        subtitleInput.value = data.subtitle || '';
        data.suggestions.forEach(d => {
            const block = addSuggestionBlock();
            block.querySelector('.suggestion-title').value = d.title;
            block.querySelector('.suggestion-description').value = d.desc;
            block.querySelector('.suggestion-list').value = d.list;
            block.querySelector('.suggestion-emphasis').value = d.emph;
        });
        updateOutput();
    };

    addSuggestionBtn.addEventListener('click', () => addSuggestionBlock());
    loadExampleBtn.addEventListener('click', loadExample);
    copyBtn.addEventListener('click', () => {
        if (!markdownOutput.value) return;
        navigator.clipboard.writeText(markdownOutput.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#3ba55d';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 1500);
        });
    });

    addInputListeners(document.body);
    addSuggestionBlock();
    updateOutput();
});